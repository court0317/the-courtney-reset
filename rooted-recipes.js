(() => {
  'use strict';
  const STORAGE_KEY = 'rooted-my-recipes-v1';
  const TAG_OPTIONS = ['Breakfast','Lunch','Dinner','Snack','Dessert'];
  const BUNDLED_RECIPE_IDS = new Set([
    'spagbol','steak','thai-pumpkin','honey-soy','burger','creamy-chicken-pasta','taco-bowl','loaded-potato','weekend-empanadas','protein-snack','oats-topup','popcorn-plus','toast-topup','choc-oats','banana-oats','vegemite-toast','leftover-placeholder','chicken-wrap','soup-lunch','pizza-scrolls','empanadas'
  ]);
  const BUNDLED_RECIPE_NAMES = new Set([
    'Spaghetti bolognese — tomato free',
    'Honey soy chicken and rice',
    'Homemade burger night',
    'Taco bowl — no tomato',
    'Loaded baked potato',
    'Steak with mash',
    'Creamy chicken pasta',
    'Homemade empanadas',
    'Vegemite toast',
    'Chocolate overnight oats',
    'Banana overnight oats',
    'Popcorn and a protein side',
    'Protein snack plate',
    'Small overnight oats'
  ]);
  const $ = id => document.getElementById(id);
  const section = $('myRecipesSection');
  if (!section) return;

  const DRAFT_STORAGE_KEY = 'rooted-recipe-draft-v1';
  let recipes = [];
  let favouritesOnly = false;
  let pendingImportedRecipe = null;
  let importingRecipe = false;
  let currentFolder = 'all';
  let pendingPhoto = '';
  let selectedTags = [];
  let currentStep = 1;
  let recipeToastTimer = null;
  let draftRestoreTimer = null;

  function loadRecipes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (_) { return []; }
  }
  function migrateRecipes(recipeList) {
    if (!Array.isArray(recipeList)) return [];
    const cleaned = recipeList.filter(recipe => {
      const id = String(recipe?.id ?? '').trim();
      const name = String(recipe?.name ?? '').trim();
      if (id && BUNDLED_RECIPE_IDS.has(id)) return false;
      if (name && BUNDLED_RECIPE_NAMES.has(name)) return false;
      return true;
    });
    return cleaned;
  }
  function initialiseRecipes() {
    const storedRecipes = loadRecipes();
    const cleanedRecipes = migrateRecipes(storedRecipes);
    const changed = JSON.stringify(storedRecipes) !== JSON.stringify(cleanedRecipes);
    recipes = cleanedRecipes;
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
      if (window.RootedCloud?.user) window.RootedCloud.syncNow?.();
    }
  }
  function saveRecipes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    if (window.RootedCloud?.user) window.RootedCloud.syncNow?.();
    renderRecipes();
  }
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const num = id => Math.max(0, Number($(id).value || 0));

  function showRecipeToast(message) {
    let toast = $('recipeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'recipeToast';
      toast.className = 'recipe-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(recipeToastTimer);
    recipeToastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function loadRecipeDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function hasRecipeDraftContent(draft) {
    if (!draft || typeof draft !== 'object') return false;
    const entries = [draft.recipeUrl, draft.name, draft.photo, draft.mealType, draft.serves, draft.calories, draft.protein, draft.carbs, draft.fat, draft.fibre, draft.prep, draft.cook, draft.ingredients, draft.method, draft.tags, draft.favourite];
    return entries.some(value => {
      if (Array.isArray(value)) return value.some(item => String(item || '').trim());
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'boolean') return value;
      return false;
    });
  }

  function saveRecipeDraft() {
    const draft = {
      recipeUrl: $('recipeImportUrl')?.value?.trim() || '',
      name: $('recipeName')?.value?.trim() || '',
      photo: pendingPhoto || '',
      mealType: $('recipeType')?.value || 'Dinner',
      serves: $('recipeServes')?.value || '',
      calories: $('recipeCalories')?.value || '',
      protein: $('recipeProtein')?.value || '',
      carbs: $('recipeCarbs')?.value || '',
      fat: $('recipeFat')?.value || '',
      fibre: $('recipeFiber')?.value || '',
      prep: $('recipePrep')?.value || '',
      cook: $('recipeCook')?.value || '',
      ingredients: $('recipeIngredients')?.value.split(/\n+/).map(item => item.trim()).filter(Boolean) || [],
      method: $('recipeMethod')?.value?.trim() || '',
      tags: Array.isArray(selectedTags) ? selectedTags.filter(Boolean) : [],
      favourite: !!$('recipeFavourite')?.checked,
      updatedAt: new Date().toISOString()
    };
    if (!hasRecipeDraftContent(draft)) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return false;
    }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return true;
  }

  function clearRecipeDraft() {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    const importStatus = $('recipeImportStatus');
    const importError = $('recipeImportError');
    const editorStatus = $('recipeEditorDraftStatus');
    const importDraftStatus = $('recipeImportDraftStatus');
    if (importStatus) importStatus.textContent = '';
    if (importError) importError.textContent = '';
    if (editorStatus) editorStatus.textContent = '';
    if (importDraftStatus) importDraftStatus.textContent = '';
  }

  function showDraftRestoredMessage(targetId = 'recipeEditorDraftStatus') {
    const target = $(targetId);
    if (!target) return;
    target.textContent = 'Draft restored';
    clearTimeout(draftRestoreTimer);
    draftRestoreTimer = setTimeout(() => {
      if (target.isConnected) target.textContent = '';
    }, 1600);
  }

  function applyRecipeDraftToForm(draft) {
    $('recipeEditorForm').reset();
    $('recipeFolder').value = draft?.folder || '';
    $('recipeEditId').value = draft?.id || '';
    $('recipeEditorTitle').textContent = draft?.id ? 'Edit recipe' : 'Create a recipe';
    $('recipeEditorSubtitle').textContent = draft?.id ? 'Tweak the details and keep your recipe book feeling fresh.' : 'Build your next favourite meal in a few calm steps.';
    $('recipeName').value = draft?.name || '';
    $('recipeType').value = draft?.mealType || draft?.type || 'Dinner';
    $('recipeServes').value = draft?.serves || 4;
    $('recipeCalories').value = draft?.calories || '';
    $('recipeProtein').value = draft?.protein || '';
    $('recipeCarbs').value = draft?.carbs || '';
    $('recipeFat').value = draft?.fat || '';
    $('recipeFiber').value = draft?.fibre || '';
    $('recipePrep').value = draft?.prep || '';
    $('recipeCook').value = draft?.cook || '';
    $('recipeIngredients').value = Array.isArray(draft?.ingredients) ? draft.ingredients.join('\n') : '';
    $('recipeMethod').value = draft?.method || '';
    $('recipeFavourite').checked = !!draft?.favourite;
    selectedTags = Array.isArray(draft?.tags) ? draft.tags : [];
    pendingPhoto = draft?.photo || '';
    currentStep = 1;
    $('recipePhotoPreview').src = pendingPhoto;
    $('recipePhotoPreview').hidden = !pendingPhoto;
    $('recipePhotoHint').textContent = pendingPhoto ? 'Current photo saved — choose another to replace it' : 'Choose a photo from your phone or computer';
    updateIngredientCount();
    updateMethodPreview();
    refreshTagButtons();
    updateStepUI();
  }

  function restoreRecipeDraftIntoEditor() {
    const draft = loadRecipeDraft();
    if (!draft) return false;
    if ($('recipeImportUrl')) $('recipeImportUrl').value = draft.recipeUrl || '';
    applyRecipeDraftToForm(draft);
    showDraftRestoredMessage('recipeEditorDraftStatus');
    return true;
  }

  function restoreRecipeDraftIntoImport() {
    const draft = loadRecipeDraft();
    if (!draft) return false;
    if ($('recipeImportUrl')) $('recipeImportUrl').value = draft.recipeUrl || '';
    showDraftRestoredMessage('recipeImportDraftStatus');
    return true;
  }

  function updateStepUI() {
    document.querySelectorAll('.recipe-step-pill').forEach(btn => {
      const isActive = Number(btn.dataset.stepPill) === currentStep;
      btn.classList.toggle('active', isActive);
    });
    document.querySelectorAll('.recipe-step-panel').forEach(panel => {
      const isActive = Number(panel.dataset.stepPanel) === currentStep;
      panel.classList.toggle('active', isActive);
    });
    $('recipeBackBtn').hidden = currentStep === 1;
    $('recipeNextBtn').hidden = currentStep === 5;
    $('recipeSubmitBtn').hidden = currentStep !== 5;
  }

  function updateMethodPreview() {
    const method = $('recipeMethod').value.trim();
    const items = method.split(/\n+/).map(line => line.trim()).filter(Boolean);
    $('recipeMethodPreview').innerHTML = items.length ? items.map((line, index) => `<div>${index + 1}. ${esc(line)}</div>`).join('') : '<div>Start writing your method and the preview will appear here.</div>';
  }

  function updateIngredientCount() {
    const count = $('recipeIngredients').value.split(/\n+/).map(x => x.trim()).filter(Boolean).length;
    $('recipeIngredientCount').textContent = `${count} ingredient${count === 1 ? '' : 's'}`;
  }

  function refreshTagButtons() {
    document.querySelectorAll('[data-recipe-tag]').forEach(btn => {
      btn.classList.toggle('active', selectedTags.includes(btn.dataset.recipeTag));
    });
  }

  function toggleTag(tag) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(item => item !== tag)
      : [...selectedTags, tag];
    refreshTagButtons();
  }

  function refreshFolderFilter() {
    const filter = $('recipeFolderFilter');
    if (!filter) return;
    const current = filter.value;
    const folders = Array.from(new Set(recipes.map(r => r.folder).filter(Boolean))).sort();
    const previous = filter.value;
    const options = ['all','favourites','uncategorised',...folders].map(value => `<option value="${esc(value)}" ${value===previous?'selected':''}>${value === 'all' ? 'All folders' : value === 'favourites' ? 'Favourites' : value === 'uncategorised' ? 'Unsorted' : esc(value)}</option>`).join('');
    filter.innerHTML = options;
    if (current && Array.from(filter.options).some(option => option.value === current)) filter.value = current;
    else filter.value = 'all';
  }

  function renderRecipes() {
    refreshFolderFilter();
    const query = $('recipeSearch').value.trim().toLowerCase();
    const sort = $('recipeSort')?.value || 'newest';
    let list = recipes.filter(r => !favouritesOnly || r.favourite);
    if (currentFolder === 'favourites') list = list.filter(r => r.favourite);
    if (currentFolder === 'uncategorised') list = list.filter(r => !r.folder);
    if (query) list = list.filter(r => [r.name,r.type,r.folder||'',...(r.tags||[]),...(r.ingredients||[])].join(' ').toLowerCase().includes(query));
    switch (sort) {
      case 'oldest': list = [...list].sort((a,b) => (a.createdAt || '').localeCompare(b.createdAt || '')); break;
      case 'protein': list = [...list].sort((a,b) => (b.protein || 0) - (a.protein || 0)); break;
      case 'calories': list = [...list].sort((a,b) => (a.calories || 9999) - (b.calories || 9999)); break;
      case 'prep': list = [...list].sort((a,b) => (a.prep || 9999) - (b.prep || 9999)); break;
      case 'alpha': list = [...list].sort((a,b) => (a.name || '').localeCompare(b.name || '')); break;
      default: list = [...list].sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
    }
    $('recipeFavouritesBtn').textContent = favouritesOnly ? '♥ Showing favourites' : '♡ Favourites';
    $('recipeFavouritesBtn').classList.toggle('active', favouritesOnly);
    $('myRecipesGrid').innerHTML = list.length ? list.map(r => {
      const nutrition = [r.calories ? `${r.calories} cal` : null, r.protein ? `${r.protein}g protein` : null, r.carbs ? `${r.carbs}g carbs` : null, r.fat ? `${r.fat}g fat` : null].filter(Boolean);
      const tags = (r.tags || []).slice(0, 3).map(tag => `<span class="saved-recipe-chip">${esc(tag)}</span>`).join('');
      return `
      <article class="saved-recipe" data-view-recipe="${esc(r.id)}">
        <div class="saved-recipe-photo">${r.photo ? `<img src="${r.photo}" alt="${esc(r.name)}">` : '<span>🍽️</span>'}</div>
        <div class="saved-recipe-body">
          <div class="saved-recipe-top"><span class="eyebrow">${esc(r.type)}</span><button class="recipe-heart" data-favourite-recipe="${esc(r.id)}" aria-label="Favourite">${r.favourite?'♥':'♡'}</button></div>
          <h4>${esc(r.name)}</h4>
          <div class="saved-recipe-meta"><span>👥 ${r.serves || 1}</span>${r.prep ? `<span>⏱ ${r.prep}m</span>` : ''}${r.cook ? `<span>🍳 ${r.cook}m</span>` : ''}${r.folder ? `<span>📁 ${esc(r.folder)}</span>` : ''}</div>
          <p>${nutrition.length ? nutrition.join(' · ') : 'Nutrition optional'}</p>
          ${tags ? `<div class="saved-recipe-tags">${tags}</div>` : ''}
          <div class="saved-recipe-actions">
            <div class="saved-recipe-action-row">
              <button class="outline" data-view-recipe="${esc(r.id)}">View</button>
              <button class="text-btn" data-cook-recipe="${esc(r.id)}">Cook tonight</button>
              <button class="text-btn" data-add-plan-recipe="${esc(r.id)}">Meal plan</button>
              <button class="text-btn" data-add-shop-recipe="${esc(r.id)}">Add to list</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join('') : `<div class="empty recipe-empty"><b>${recipes.length ? 'No recipes match that search.' : 'You haven\'t added any recipes yet.'}</b><p>${recipes.length ? 'Try another word or show all recipes.' : 'Save your first recipe here and it will appear in your personal recipe book.'}</p>${!recipes.length ? '<button class="primary" type="button" data-open-recipe-editor="true">Add your first recipe</button>' : ''}</div>`;
  }

  function resetForm(recipe = null) {
    const source = recipe && typeof recipe === 'object' ? recipe : null;
    $('recipeEditorForm').reset();
    $('recipeFolder').value = source?.folder || '';
    $('recipeEditId').value = source?.id || '';
    $('recipeEditorTitle').textContent = source ? 'Edit recipe' : 'Create a recipe';
    $('recipeEditorSubtitle').textContent = source ? 'Tweak the details and keep your recipe book feeling fresh.' : 'Build your next favourite meal in a few calm steps.';
    $('recipeName').value = source?.name || '';
    $('recipeType').value = source?.mealType || source?.type || 'Dinner';
    $('recipeServes').value = source?.serves || 4;
    $('recipeCalories').value = source?.calories || '';
    $('recipeProtein').value = source?.protein || '';
    $('recipeCarbs').value = source?.carbs || '';
    $('recipeFat').value = source?.fat || '';
    $('recipeFiber').value = source?.fibre || '';
    $('recipePrep').value = source?.prep || '';
    $('recipeCook').value = source?.cook || '';
    $('recipeIngredients').value = (source?.ingredients || []).join('\n');
    $('recipeMethod').value = source?.method || '';
    $('recipeFavourite').checked = !!source?.favourite;
    selectedTags = Array.isArray(source?.tags) ? source.tags : [];
    pendingPhoto = source?.photo || '';
    currentStep = 1;
    $('recipePhotoPreview').src = pendingPhoto;
    $('recipePhotoPreview').hidden = !pendingPhoto;
    $('recipePhotoHint').textContent = pendingPhoto ? 'Current photo saved — choose another to replace it' : 'Choose a photo from your phone or computer';
    updateIngredientCount();
    updateMethodPreview();
    refreshTagButtons();
    updateStepUI();
  }

  function openEditor(recipe = null) {
    if (!recipe) {
      const restored = restoreRecipeDraftIntoEditor();
      if (!restored) resetForm(recipe);
    } else {
      resetForm(recipe);
    }
    $('recipeEditorModal').showModal();
  }

  function openImportModal() {
    const restored = restoreRecipeDraftIntoImport();
    if (!restored) {
      $('recipeImportUrl').value = '';
      $('recipeImportStatus').textContent = '';
      $('recipeImportError').textContent = '';
    }
    $('recipeImportModal').showModal();
  }

  function closeImportModal() {
    $('recipeImportModal')?.close?.();
  }

  function parseDuration(value) {
    if (!value) return '';
    if (typeof value === 'number') return String(value);
    const match = String(value).trim().match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
    if (!match) return '';
    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);
    return String(Math.round(hours * 60 + minutes + seconds / 60));
  }

  function flattenInstructions(value) {
    if (!value) return '';
    if (Array.isArray(value)) {
      const parts = value.map(item => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          if (item.text) return item.text;
          if (item.name) return item.name;
          if (item['@value']) return item['@value'];
          if (item['text']) return item['text'];
          if (Array.isArray(item.itemListElement)) {
            return item.itemListElement.map(entry => entry.text || entry.name || '').filter(Boolean).join(' ');
          }
          return '';
        }
        return '';
      }).filter(Boolean);
      return parts.join('\n');
    }
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object') {
      if (value.text) return value.text;
      if (value.name) return value.name;
      if (value['@value']) return value['@value'];
      if (Array.isArray(value.itemListElement)) {
        return value.itemListElement.map(entry => entry.text || entry.name || '').filter(Boolean).join(' ');
      }
    }
    return '';
  }

  function normaliseRecipeData(data) {
    const recipe = data && typeof data === 'object' ? data : null;
    if (!recipe) return null;
    const image = recipe.image || recipe.photo || recipe['image'] || '';
    const imageValue = Array.isArray(image) ? image[0] : typeof image === 'object' ? image.url || image.contentUrl || '' : image;
    const ingredients = Array.isArray(recipe.recipeIngredient)
      ? recipe.recipeIngredient.filter(Boolean).map(item => String(item).trim())
      : typeof recipe.recipeIngredient === 'string'
        ? recipe.recipeIngredient.split(/\n|;|\u2028/).map(item => item.trim()).filter(Boolean)
        : [];
    const instructions = flattenInstructions(recipe.recipeInstructions);
    const yieldValue = recipe.recipeYield ? (Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield) : '';
    const nutrition = recipe.nutrition || {};
    const calories = nutrition.calories || nutrition.energy || '';
    const protein = nutrition.proteinContent || '';
    const carbs = nutrition.carbohydrateContent || '';
    const fat = nutrition.fatContent || '';
    const fibre = nutrition.fiberContent || '';
    const category = recipe.recipeCategory || recipe.category || '';
    const cuisine = recipe.recipeCuisine || '';
    const keywords = recipe.keywords || '';
    return {
      name: recipe.name || '',
      image: imageValue || '',
      description: recipe.description || '',
      ingredients,
      method: instructions || '',
      serves: typeof yieldValue === 'number' ? yieldValue : (typeof yieldValue === 'string' ? Number(yieldValue.replace(/\D/g, '')) || 4 : 4),
      prep: parseDuration(recipe.prepTime || '') || '',
      cook: parseDuration(recipe.cookTime || recipe.totalTime || '') || '',
      type: (category || 'Dinner').toString(),
      calories: calories ? Number(String(calories).replace(/\D/g, '')) || '' : '',
      protein: protein ? Number(String(protein).replace(/\D/g, '')) || '' : '',
      carbs: carbs ? Number(String(carbs).replace(/\D/g, '')) || '' : '',
      fat: fat ? Number(String(fat).replace(/\D/g, '')) || '' : '',
      fibre: fibre ? Number(String(fibre).replace(/\D/g, '')) || '' : '',
      tags: typeof keywords === 'string' ? keywords.split(',').map(item => item.trim()).filter(Boolean) : []
    };
  }

  function walkSchemaObjects(value) {
    const results = [];
    if (!value) return results;
    if (Array.isArray(value)) {
      value.forEach(item => results.push(...walkSchemaObjects(item)));
      return results;
    }
    if (typeof value !== 'object') return results;
    if (value['@type'] || value['@graph']) {
      if (value['@type'] === 'Recipe' || value['@type'] === 'https://schema.org/Recipe') results.push(value);
      if (Array.isArray(value['@graph'])) value['@graph'].forEach(item => results.push(...walkSchemaObjects(item)));
    }
    if (value['recipeIngredient'] || value['recipeInstructions'] || value['name']) {
      results.push(value);
    }
    return results;
  }

  function extractRecipeFromHtml(html) {
    const recipeMatches = [];
    const scripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    scripts.forEach(script => {
      const content = script.match(/>([\s\S]*?)<\//);
      if (!content) return;
      try {
        const parsed = JSON.parse(content[1]);
        const found = walkSchemaObjects(parsed);
        if (found.length) recipeMatches.push(...found);
      } catch (_) {}
    });
    return recipeMatches.length ? recipeMatches[0] : null;
  }

  function prepareImportedRecipe(recipeData) {
    const normalised = normaliseRecipeData(recipeData);
    if (!normalised) return null;
    pendingImportedRecipe = {
      id: '',
      name: normalised.name || 'Imported recipe',
      type: normalised.type || 'Dinner',
      serves: normalised.serves || 4,
      photo: normalised.image || '',
      calories: normalised.calories || '',
      protein: normalised.protein || '',
      carbs: normalised.carbs || '',
      fat: normalised.fat || '',
      fibre: normalised.fibre || '',
      prep: normalised.prep || '',
      cook: normalised.cook || '',
      ingredients: normalised.ingredients || [],
      method: normalised.method || '',
      tags: normalised.tags || [],
      favourite: false,
      folder: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return pendingImportedRecipe;
  }

  async function importRecipeFromUrl(url) {
    const safeUrl = String(url || '').trim();
    if (!safeUrl) return { success: false, message: 'Please enter a recipe URL.' };
    const parsedUrl = new URL(safeUrl);
    if (!parsedUrl.protocol.startsWith('http')) return { success: false, message: 'Please enter a valid recipe URL.' };
    try {
      $('recipeImportStatus').textContent = 'Importing recipe…';
      $('recipeImportError').textContent = '';
      importingRecipe = true;
      const response = await fetch(parsedUrl.href);
      if (!response.ok) throw new Error('fetch failed');
      const html = await response.text();
      const recipeData = extractRecipeFromHtml(html);
      if (!recipeData) {
        return { success: false, message: 'This website blocks direct importing. Copy and paste the recipe text manually for now.' };
      }
      const importedRecipe = prepareImportedRecipe(recipeData);
      if (!importedRecipe) {
        return { success: false, message: 'This website blocks direct importing. Copy and paste the recipe text manually for now.' };
      }
      pendingImportedRecipe = importedRecipe;
      resetForm(importedRecipe);
      saveRecipeDraft();
      closeImportModal();
      $('recipeEditorModal').showModal();
      return { success: true, message: 'Recipe imported. Review and save it to your collection.' };
    } catch (error) {
      return { success: false, message: 'This website blocks direct importing. Copy and paste the recipe text manually for now.' };
    } finally {
      importingRecipe = false;
      $('recipeImportStatus').textContent = '';
    }
  }

  function viewRecipe(id) {
    const r = recipes.find(x => x.id === id); if (!r) return;
    $('recipeViewContent').innerHTML = `
      <div class="recipe-card-shell">
        ${r.photo ? `<img class="recipe-view-photo" src="${r.photo}" alt="${esc(r.name)}">` : '<div class="recipe-view-photo recipe-view-photo-placeholder">🍽️</div>'}
        <div class="recipe-card-copy">
          <span class="eyebrow">${esc(r.type)}</span>
          <h2>${esc(r.name)}</h2>
          <div class="recipe-meta"><span>👥 ${r.serves || 1} serves</span>${r.prep?`<span>⏱ ${r.prep} min prep</span>`:''}${r.cook?`<span>🍳 ${r.cook} min cook</span>`:''}</div>
          <div class="recipe-macro-grid">${r.calories?`<div><b>${r.calories}</b><small>cal</small></div>`:''}${r.protein?`<div><b>${r.protein}g</b><small>protein</small></div>`:''}${r.carbs?`<div><b>${r.carbs}g</b><small>carbs</small></div>`:''}${r.fat?`<div><b>${r.fat}g</b><small>fat</small></div>`:''}${r.fibre?`<div><b>${r.fibre}g</b><small>fibre</small></div>`:''}</div>
          ${(r.tags||[]).length ? `<div class="recipe-tags">${r.tags.map(t=>`<span class="saved-recipe-chip">${esc(t)}</span>`).join('')}</div>` : ''}
          <div class="recipe-section">
            <h3>Ingredients</h3>
            <ul class="recipe-ingredient-list">${(r.ingredients||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div class="recipe-section">
            <h3>Method</h3>
            <div class="recipe-method-full">${esc(r.method || '').replace(/\n/g,'<br>')}</div>
          </div>
          <div class="recipe-view-actions"><button class="primary" data-cook-recipe="${esc(r.id)}">Cook tonight</button><button class="outline" data-add-plan-recipe="${esc(r.id)}">Add to meal plan</button><button class="outline" data-add-shop-recipe="${esc(r.id)}">Add to shopping list</button><button class="outline" data-edit-recipe="${esc(r.id)}">Edit</button><button class="text-btn danger" data-delete-recipe="${esc(r.id)}">Delete</button></div>
        </div>
      </div>`;
    $('recipeViewModal').showModal();
  }

  function addToToday(id) {
    const r = recipes.find(x => x.id === id); if (!r) return;
    const meal = {id:`custom-${r.id}`,type:r.type,name:r.name,icon:r.photo ? '📸' : '🍽️',cal:r.calories||0,protein:r.protein||0,carbs:r.carbs||0,fat:r.fat||0,fibre:r.fibre||0,ingredients:r.ingredients,method:r.method,customRecipe:true};
    if (typeof setMeal === 'function') {
      const allowed = ['Breakfast','Lunch','Dinner','Snack'];
      setMeal(allowed.includes(r.type) ? r.type : 'Snack', meal);
      $('recipeViewModal')?.close();
      showRecipeToast(`${r.name} added to today.`);
    } else showRecipeToast('Recipe saved. Refresh Rooted, then try adding it to today again.');
  }

  function addToShoppingList(id) {
    const r = recipes.find(x => x.id === id); if (!r) return;
    const items = (window.RootedAppState?.shoppingList || []);
    const additions = [...(r.ingredients || []), ...(r.tags || [])];
    additions.forEach(item => {
      const text = String(item || '').trim();
      if (text && !items.includes(text)) items.push(text);
    });
    if (window.RootedAppState) {
      window.RootedAppState.shoppingList = items;
      window.RootedAppStateSave?.();
    }
    showRecipeToast(`${r.name} added to shopping.`);
  }

  function addToMealPlan(id) {
    addToToday(id);
    showRecipeToast(`${recipes.find(x=>x.id===id)?.name || 'Recipe'} added to the plan.`);
  }

  $('addRecipeBtn').addEventListener('click', () => openEditor());
  $('importRecipeBtn').addEventListener('click', () => openImportModal());
  $('recipeImportSubmitBtn').addEventListener('click', async () => {
    const url = $('recipeImportUrl').value;
    const result = await importRecipeFromUrl(url);
    $('recipeImportStatus').textContent = result.message;
    if (!result.success) $('recipeImportError').textContent = result.message;
  });
  $('recipeImportCancelBtn').addEventListener('click', closeImportModal);
  $('recipeImportClearBtn').addEventListener('click', () => {
    clearRecipeDraft();
    $('recipeImportUrl').value = '';
    $('recipeImportStatus').textContent = '';
    $('recipeImportError').textContent = '';
    resetForm();
  });
  $('recipeSearch').addEventListener('input', renderRecipes);
  $('recipeSort').addEventListener('change', renderRecipes);
  $('recipeFolderFilter').addEventListener('change', event => { currentFolder = event.target.value; renderRecipes(); });
  $('recipeFavouritesBtn').addEventListener('click', () => { favouritesOnly = !favouritesOnly; renderRecipes(); });
  $('recipePhoto').addEventListener('change', event => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) { alert('Please choose a photo smaller than 2.5 MB.'); event.target.value=''; return; }
    const reader = new FileReader(); reader.onload = () => { pendingPhoto = reader.result; $('recipePhotoPreview').src = pendingPhoto; $('recipePhotoPreview').hidden=false; saveRecipeDraft(); }; reader.readAsDataURL(file);
  });
  $('recipeIngredients').addEventListener('input', () => { updateIngredientCount(); saveRecipeDraft(); });
  $('recipeMethod').addEventListener('input', () => { updateMethodPreview(); saveRecipeDraft(); });
  $('recipeNextBtn').addEventListener('click', () => {
    if (currentStep < 5) currentStep += 1;
    updateStepUI();
  });
  $('recipeBackBtn').addEventListener('click', () => {
    if (currentStep > 1) currentStep -= 1;
    updateStepUI();
  });
  $('recipeClearDraftBtn').addEventListener('click', () => {
    clearRecipeDraft();
    resetForm();
  });
  document.querySelectorAll('[data-step-pill]').forEach(btn => btn.addEventListener('click', () => {
    currentStep = Number(btn.dataset.stepPill);
    updateStepUI();
  }));
  $('recipeEditorForm').addEventListener('submit', event => {
    event.preventDefault();
    const id = $('recipeEditId').value || (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`);
    const existing = recipes.find(x => x.id === id);
    const recipe = {id,name:$('recipeName').value.trim(),type:$('recipeType').value,serves:num('recipeServes')||1,photo:pendingPhoto,calories:num('recipeCalories'),protein:num('recipeProtein'),carbs:num('recipeCarbs'),fat:num('recipeFat'),fibre:num('recipeFiber'),prep:num('recipePrep'),cook:num('recipeCook'),ingredients:$('recipeIngredients').value.split('\n').map(x=>x.trim()).filter(Boolean),method:$('recipeMethod').value.trim(),tags:selectedTags.filter(Boolean),favourite:$('recipeFavourite').checked,folder:$('recipeFolder').value.trim()||'',createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
    recipes = existing ? recipes.map(x => x.id === id ? recipe : x) : [recipe, ...recipes];
    saveRecipes();
    clearRecipeDraft();
    $('recipeEditorModal').close();
    showRecipeToast(existing ? 'Recipe updated.' : 'Recipe saved.');
  });

  document.addEventListener('click', event => {
    const openEditorButton = event.target.closest('[data-open-recipe-editor]');
    if (openEditorButton) { event.preventDefault(); event.stopPropagation(); openEditor(); return; }
    const favourite = event.target.closest('[data-favourite-recipe]');
    if (favourite) { event.preventDefault(); event.stopPropagation(); const r=recipes.find(x=>x.id===favourite.dataset.favouriteRecipe); if(r){r.favourite=!r.favourite;saveRecipes();} return; }
    const add = event.target.closest('[data-cook-recipe]'); if (add) { event.preventDefault(); event.stopPropagation(); addToToday(add.dataset.cookRecipe); return; }
    const addPlan = event.target.closest('[data-add-plan-recipe]'); if (addPlan) { event.preventDefault(); event.stopPropagation(); addToMealPlan(addPlan.dataset.addPlanRecipe); return; }
    const addShop = event.target.closest('[data-add-shop-recipe]'); if (addShop) { event.preventDefault(); event.stopPropagation(); addToShoppingList(addShop.dataset.addShopRecipe); return; }
    const edit = event.target.closest('[data-edit-recipe]'); if(edit){ const r=recipes.find(x=>x.id===edit.dataset.editRecipe); $('recipeViewModal').close(); openEditor(r); return; }
    const del = event.target.closest('[data-delete-recipe]'); if(del){ const r=recipes.find(x=>x.id===del.dataset.deleteRecipe); if(r&&confirm(`Delete ${r.name}?`)){recipes=recipes.filter(x=>x.id!==r.id);saveRecipes();$('recipeViewModal').close();} return; }
    const view = event.target.closest('[data-view-recipe]'); if(view) viewRecipe(view.dataset.viewRecipe);
  });
  document.querySelectorAll('[data-recipe-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleTag(btn.dataset.recipeTag);
      saveRecipeDraft();
    });
  });
  document.querySelectorAll('.recipe-modal .modal-close').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
  ['recipeName','recipeFolder','recipeType','recipeServes','recipeCalories','recipeProtein','recipeCarbs','recipeFat','recipeFiber','recipePrep','recipeCook','recipeImportUrl'].forEach(id => {
    const field = $(id);
    if (field) {
      field.addEventListener('input', saveRecipeDraft);
      field.addEventListener('change', saveRecipeDraft);
    }
  });
  $('recipeFavourite').addEventListener('change', saveRecipeDraft);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if ($('recipeEditorModal')?.open) restoreRecipeDraftIntoEditor();
      if ($('recipeImportModal')?.open) restoreRecipeDraftIntoImport();
    }
  });
  initialiseRecipes();
  window.RootedRecipes = {
    getRecipes: () => recipes,
    refresh: renderRecipes,
    save: saveRecipes
  };
  renderRecipes();
  updateIngredientCount();
  updateMethodPreview();
  updateStepUI();
})();
