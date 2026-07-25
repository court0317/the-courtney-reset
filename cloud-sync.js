(() => {
  'use strict';

  if (window.flourishBloomStorageMigration?.migrate) window.flourishBloomStorageMigration.migrate();
  const CONFIG = window.FLOURISH_BLOOM_SUPABASE_CONFIG || {};
  const configured = Boolean(
    CONFIG.url &&
    CONFIG.publishableKey &&
    !CONFIG.publishableKey.includes('PASTE_YOUR') &&
    window.supabase?.createClient
  );
  const FLOURISH_BLOOM_PREFIXES = ['flourishBloom', 'flourishBloom-'];
  const APP_STATE_TABLE = 'rooted_app_state';
  const CLOUD_META_KEY = 'flourishBloom-cloud-meta-v1';
  const DEVICE_ID_KEY = 'flourishBloom-device-id-v1';
  let client = null;
  let currentUser = null;
  let uploadTimer = null;
  let applyingCloud = false;
  let readyResolve;

  window.FlourishBloomCloud = {
    configured,
    ready: new Promise(resolve => { readyResolve = resolve; }),
    syncNow: () => pushSnapshot(true),
    openAccount: () => renderAccountPanel(),
    get user() { return currentUser; }
  };

  function isFlourishBloomKey(key) {
    return key && FLOURISH_BLOOM_PREFIXES.some(prefix => key.startsWith(prefix)) && key !== CLOUD_META_KEY;
  }

  function getOrCreateDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  function snapshot() {
    const data = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (isFlourishBloomKey(key)) data[key] = localStorage.getItem(key);
    }
    return {
      version: 1,
      deviceId: getOrCreateDeviceId(),
      savedAt: new Date().toISOString(),
      values: data
    };
  }

  function hasMeaningfulLocalData() {
    return Object.keys(snapshot().values).some(key => {
      const value = snapshot().values[key];
      return value && value !== '{}' && value !== 'null' && value !== '[]';
    });
  }

  function applySnapshot(cloudData) {
    if (!cloudData?.values || typeof cloudData.values !== 'object') return false;
    applyingCloud = true;
    try {
      Object.entries(cloudData.values).forEach(([key, value]) => {
        if (isFlourishBloomKey(key) && typeof value === 'string') localStorage.setItem(key, value);
      });
      localStorage.setItem(CLOUD_META_KEY, JSON.stringify({
        lastPulledAt: new Date().toISOString(),
        cloudSavedAt: cloudData.savedAt || null
      }));
      return true;
    } finally {
      applyingCloud = false;
    }
  }

  function queueUpload() {
    if (!currentUser || applyingCloud) return;
    clearTimeout(uploadTimer);
    uploadTimer = setTimeout(() => pushSnapshot(false), 900);
  }

  function notifyCloudStateChanged() {
    window.dispatchEvent(new CustomEvent('flourishBloom:cloud-sync-updated', { detail: { source: 'cloud' } }));
  }

  function clearSyncWarning() {
    document.getElementById('flourishBloomSyncWarning')?.remove();
  }

  function showSyncWarning(message) {
    let banner = document.getElementById('flourishBloomSyncWarning');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'flourishBloomSyncWarning';
      banner.setAttribute('role', 'status');
      banner.setAttribute('aria-live', 'polite');
      banner.style.position = 'fixed';
      banner.style.right = '16px';
      banner.style.bottom = '16px';
      banner.style.maxWidth = 'min(420px, calc(100vw - 32px))';
      banner.style.padding = '10px 12px';
      banner.style.borderRadius = '10px';
      banner.style.fontSize = '13px';
      banner.style.lineHeight = '1.35';
      banner.style.background = '#fff4da';
      banner.style.color = '#5d4300';
      banner.style.border = '1px solid #dfc88a';
      banner.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.08)';
      banner.style.zIndex = '10000';
      document.body.appendChild(banner);
    }
    banner.textContent = message;
  }

  async function pushSnapshot(showStatus) {
    if (!client || !currentUser) return false;
    setCloudStatus('syncing', 'Saving…');
    const payload = snapshot();
    const { error } = await client
      .from(APP_STATE_TABLE)
      .upsert({ user_id: currentUser.id, data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) {
      console.error('Flourish & Bloom cloud save failed', error);
      setCloudStatus('error', 'Not synced');
      if (showStatus) showSyncWarning(`Cloud sync warning: ${friendlyError(error)}`);
      return false;
    }
    localStorage.setItem(CLOUD_META_KEY, JSON.stringify({ lastPushedAt: new Date().toISOString() }));
    setCloudStatus('synced', 'Saved');
    clearSyncWarning();
    return true;
  }

  async function pullOrMigrate() {
    const { data, error } = await client
      .from(APP_STATE_TABLE)
      .select('data, updated_at')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (error) throw error;

    if (data?.data?.values && Object.keys(data.data.values).length) {
      const localMeta = JSON.parse(localStorage.getItem(CLOUD_META_KEY) || '{}');
      const alreadyLoaded = localMeta.userId === currentUser.id && localMeta.cloudSavedAt === data.data.savedAt;
      if (!alreadyLoaded) {
        applySnapshot(data.data);
        localStorage.setItem(CLOUD_META_KEY, JSON.stringify({
          userId: currentUser.id,
          cloudSavedAt: data.data.savedAt || data.updated_at,
          lastPulledAt: new Date().toISOString()
        }));
        notifyCloudStateChanged();
      }
    } else if (hasMeaningfulLocalData()) {
      await pushSnapshot(false);
    } else {
      await pushSnapshot(false);
    }
    setCloudStatus('synced', 'Saved');
    clearSyncWarning();
  }

  function friendlyError(error) {
    const msg = String(error?.message || error || 'Please try again.');
    if (/relation .* does not exist/i.test(msg)) return 'Run the supplied supabase-setup.sql file in the SQL Editor first.';
    if (/row-level security|permission denied/i.test(msg)) return 'The database security setup has not been completed.';
    return msg;
  }

  function installStorageListener() {
    const originalSet = Storage.prototype.setItem;
    const originalRemove = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;
    Storage.prototype.setItem = function(key, value) {
      originalSet.call(this, key, value);
      if (this === localStorage && isFlourishBloomKey(key)) queueUpload();
    };
    Storage.prototype.removeItem = function(key) {
      originalRemove.call(this, key);
      if (this === localStorage && isFlourishBloomKey(key)) queueUpload();
    };
    Storage.prototype.clear = function() {
      originalClear.call(this);
      if (this === localStorage) queueUpload();
    };
    window.addEventListener('storage', event => {
      if (isFlourishBloomKey(event.key)) queueUpload();
    });
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'hidden') {
        await pushSnapshot(false);
      }
    });
    window.addEventListener('pagehide', async () => {
      await pushSnapshot(false);
    });
  }

  function createGate() {
    const gate = document.createElement('div');
    gate.id = 'flourishBloomAuthGate';
    gate.className = 'cloud-auth-gate';
    gate.innerHTML = `
      <div class="cloud-auth-card">
        <div class="cloud-sprout">🌿</div>
        <span class="eyebrow">Welcome to Flourish & Bloom</span>
        <h1>Your progress, safely yours.</h1>
        <p class="cloud-auth-intro">Sign in to keep your garden, journal and progress private and synced across your devices.</p>
        <div class="cloud-auth-tabs" role="tablist">
          <button type="button" class="active" data-auth-mode="signin">Log in</button>
          <button type="button" data-auth-mode="signup">Create account</button>
        </div>
        <form id="flourishBloomAuthForm">
          <label>Email<input id="flourishBloomAuthEmail" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label>Password<input id="flourishBloomAuthPassword" type="password" autocomplete="current-password" minlength="6" required placeholder="At least 6 characters"></label>
          <button id="flourishBloomAuthSubmit" class="primary wide" type="submit">Log in</button>
          <button id="flourishBloomForgotPassword" class="cloud-link" type="button">Forgot password?</button>
          <p id="flourishBloomAuthMessage" class="cloud-auth-message" aria-live="polite"></p>
        </form>
        <p class="cloud-fineprint">Your existing progress on this device will be moved into your account the first time you sign in.</p>
      </div>`;
    document.body.appendChild(gate);

    let mode = 'signin';
    const tabs = gate.querySelectorAll('[data-auth-mode]');
    const submit = gate.querySelector('#flourishBloomAuthSubmit');
    const password = gate.querySelector('#flourishBloomAuthPassword');
    const forgot = gate.querySelector('#flourishBloomForgotPassword');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      mode = tab.dataset.authMode;
      tabs.forEach(x => x.classList.toggle('active', x === tab));
      submit.textContent = mode === 'signup' ? 'Create my account' : 'Log in';
      password.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
      forgot.hidden = mode === 'signup';
      setAuthMessage('');
    }));

    gate.querySelector('#flourishBloomAuthForm').addEventListener('submit', async event => {
      event.preventDefault();
      const email = gate.querySelector('#flourishBloomAuthEmail').value.trim();
      const pass = password.value;
      submit.disabled = true;
      submit.textContent = mode === 'signup' ? 'Creating…' : 'Logging in…';
      setAuthMessage('');
      const result = mode === 'signup'
        ? await client.auth.signUp({ email, password: pass, options: { emailRedirectTo: location.href.split('#')[0] } })
        : await client.auth.signInWithPassword({ email, password: pass });
      submit.disabled = false;
      submit.textContent = mode === 'signup' ? 'Create my account' : 'Log in';
      if (result.error) return setAuthMessage(result.error.message, true);
      if (mode === 'signup' && !result.data.session) {
        setAuthMessage('Account created. Check your email, confirm it, then come back and log in.');
      }
    });

    forgot.addEventListener('click', async () => {
      const email = gate.querySelector('#flourishBloomAuthEmail').value.trim();
      if (!email) return setAuthMessage('Enter your email address first.', true);
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] });
      setAuthMessage(error ? error.message : 'Password reset email sent.', Boolean(error));
    });
  }

  function setAuthMessage(message, error = false) {
    const el = document.getElementById('flourishBloomAuthMessage');
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('error', error);
  }

  function hideGate() {
    document.getElementById('flourishBloomAuthGate')?.remove();
  }

  function setCloudStatus(kind, text) {
    document.querySelectorAll('[data-cloud-status]').forEach(el => {
      el.dataset.state = kind;
      el.textContent = text;
    });
  }

  function injectAccountControls() {
    const settings = document.querySelector('#settings');
    if (settings && !document.getElementById('flourishBloomCloudCard')) {
      const card = document.createElement('div');
      card.id = 'flourishBloomCloudCard';
      card.className = 'card settings-form cloud-account-card';
      card.innerHTML = `
        <span class="eyebrow">Your account</span>
        <h2>Cloud backup</h2>
        <p class="cloud-account-email"></p>
        <div class="cloud-status-row"><span class="cloud-dot"></span><b data-cloud-status>Saved</b><small>Private to your account</small></div>
        <div class="cloud-account-actions">
          <button type="button" class="outline" id="flourishBloomSyncNow">Sync now</button>
          <button type="button" class="outline danger-soft" id="flourishBloomSignOut">Log out</button>
        </div>`;
      settings.insertBefore(card, settings.children[1] || null);
      card.querySelector('.cloud-account-email').textContent = currentUser?.email || '';
      card.querySelector('#flourishBloomSyncNow').addEventListener('click', () => pushSnapshot(true));
      card.querySelector('#flourishBloomSignOut').addEventListener('click', async () => {
        await pushSnapshot(false);
        await client.auth.signOut();
      });
    }
    const avatar = document.getElementById('settingsBtn');
    if (avatar) {
      avatar.title = currentUser?.email ? `Account: ${currentUser.email}` : 'Settings';
      avatar.classList.add('cloud-connected');
    }
  }

  function renderAccountPanel() {
    document.getElementById('settingsBtn')?.click();
    setTimeout(() => document.getElementById('flourishBloomCloudCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  async function boot() {
    installStorageListener();
    if (!configured) {
        console.warn('Flourish & Bloom cloud is not configured. Add the Supabase publishable key in supabase-config.js.');
      readyResolve({ configured: false });
      return;
    }
    client = window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data: { session } } = await client.auth.getSession();
    if (!session?.user) createGate();
    else {
      currentUser = session.user;
      await pullOrMigrate().catch(error => {
        console.error(error);
        showSyncWarning(`Cloud sync warning: ${friendlyError(error)}`);
        setCloudStatus('error', 'Not synced');
      });
      hideGate();
      setTimeout(injectAccountControls, 0);
    }

    client.auth.onAuthStateChange(async (event, sessionNow) => {
      if (event === 'SIGNED_OUT') {
        currentUser = null;
        document.getElementById('flourishBloomAuthGate')?.remove();
        createGate();
        setCloudStatus('saved', 'Not signed in');
        clearSyncWarning();
        return;
      }
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && sessionNow?.user) {
        currentUser = sessionNow.user;
        try {
          await pullOrMigrate();
          hideGate();
          setTimeout(injectAccountControls, 0);
        } catch (error) {
          console.error(error);
          showSyncWarning(`Cloud sync warning: ${friendlyError(error)}`);
          setCloudStatus('error', 'Not synced');
          setAuthMessage(friendlyError(error), true);
        }
      }
      if (event === 'PASSWORD_RECOVERY') {
        const next = prompt('Enter your new Flourish & Bloom password (at least 6 characters):');
        if (next && next.length >= 6) {
          const { error } = await client.auth.updateUser({ password: next });
          alert(error ? error.message : 'Your password has been updated.');
        }
      }
    });
    readyResolve({ configured: true, client });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
