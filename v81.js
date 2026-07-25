
// Rooted Volume 8.1 — backups, calendar history, weekly comparison and accessibility
(() => {
  const PREF_KEY='rooted-v81-preferences';
  const BACKUP_KEY='rooted-v81-last-backup';
  let historyCursor=new Date();
  historyCursor.setDate(1);
  let selectedHistoryDate='';

  const readPrefs=()=>{try{return JSON.parse(localStorage.getItem(PREF_KEY)||'{}')}catch{return {}}};
  const savePrefs=p=>localStorage.setItem(PREF_KEY,JSON.stringify(p));
  const isoLocal=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
  const dayKeyCandidates=date=>{
    const out=[date];
    try{
      const dt=new Date(date+'T12:00:00');
      const start=new Date(dt.getFullYear(),0,1);
      const day=Math.floor((dt-start)/86400000);
      const week=Math.floor(day/7)+1;
      const dow=(dt.getDay()+6)%7;
      out.push(`w${week}d${dow}`);
    }catch{}
    return out;
  };
  const getObj=()=>window.state||state||{};
  const anyMatching=(obj,date,predicate=Boolean)=>{
    if(!obj)return false;
    const candidates=dayKeyCandidates(date);
    return Object.entries(obj).some(([k,v])=>candidates.some(c=>k.includes(c))&&predicate(v,k));
  };
  const countMatching=(obj,date,predicate=Boolean)=>{
    if(!obj)return 0; const candidates=dayKeyCandidates(date);
    return Object.entries(obj).filter(([k,v])=>candidates.some(c=>k.includes(c))&&predicate(v,k)).length;
  };
  function dayData(date){
    const s=getObj();
    const waterDirect=Number(s.water?.[date]||0);
    const water=waterDirect||countMatching(s.water,date,v=>Number(v)>0);
    const movement=anyMatching(s.walking,date,v=>Number(v?.minutes||v||0)>0)||anyMatching(s.checks,date,v=>!!v);
    const movementCount=countMatching(s.checks,date,v=>!!v)+countMatching(s.walking,date,v=>Number(v?.minutes||v||0)>0);
    const meals=countMatching(s.mealDone,date,v=>!!v);
    let roots=0;
    try{roots=Number(JSON.parse(localStorage.getItem('rooted-daily-roots-v5')||'{}')[date]||0)}catch{}
    return {water,movement,movementCount,meals,roots,hasAny:water>0||movement||meals>0||roots>0};
  }
  function renderHistory(){
    const cal=document.getElementById('historyCalendar'); if(!cal)return;
    const y=historyCursor.getFullYear(),m=historyCursor.getMonth();
    const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate();
    const offset=(first.getDay()+6)%7;
    const label=historyCursor.toLocaleDateString('en-AU',{month:'long',year:'numeric'});
    document.getElementById('historyMonthLabel').textContent=label;
    const names=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let html=names.map(x=>`<div class="history-weekday">${x}</div>`).join('');
    html+=Array.from({length:offset},()=>'<div class="history-day empty"></div>').join('');
    let active=0;
    for(let day=1;day<=days;day++){
      const date=isoLocal(new Date(y,m,day)),d=dayData(date); if(d.hasAny)active++;
      const dots=[d.movement?'<i></i>':'',d.water?'<i class="water"></i>':'',d.meals?'<i class="meal"></i>':'',d.roots?'<i class="root"></i>':''].join('');
      html+=`<button class="history-day ${date===isoLocal(new Date())?'today':''} ${date===selectedHistoryDate?'selected':''}" data-history-date="${date}"><b>${day}</b><span class="history-dots">${dots}</span></button>`;
    }
    cal.innerHTML=html;
    document.getElementById('historyMonthSummary').textContent=`${active} active ${active===1?'day':'days'} recorded`;
    cal.querySelectorAll('[data-history-date]').forEach(btn=>btn.addEventListener('click',()=>{selectedHistoryDate=btn.dataset.historyDate;renderHistory();renderHistoryDetail(selectedHistoryDate)}));
  }
  function renderHistoryDetail(date){
    const el=document.getElementById('historyDayDetail');if(!el)return;
    const d=dayData(date),nice=new Date(date+'T12:00:00').toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'});
    el.innerHTML=`<span class="eyebrow">${nice}</span><h3>${d.hasAny?'Your daily roots':'A quiet day'}</h3><div class="history-detail-grid"><div><span>🚶</span><small>Movement</small><b>${d.movement?`${Math.max(1,d.movementCount)} item${d.movementCount===1?'':'s'} logged`:'Nothing logged'}</b></div><div><span>💧</span><small>Hydration</small><b>${d.water?`${d.water} bottle${d.water===1?'':'s'}`:'Nothing logged'}</b></div><div><span>🍽️</span><small>Meals</small><b>${d.meals?`${d.meals} completed`:'Nothing logged'}</b></div><div><span>🌱</span><small>Daily root</small><b>${d.roots?'Completed':'Not marked'}</b></div></div>`;
  }
  function weekStats(weekOffset=0){
    const now=new Date(); const monday=new Date(now); monday.setDate(now.getDate()-((now.getDay()+6)%7)+(weekOffset*7)); monday.setHours(12,0,0,0);
    let movement=0,water=0,meals=0,active=0;
    for(let i=0;i<7;i++){const dt=new Date(monday);dt.setDate(monday.getDate()+i);const d=dayData(isoLocal(dt));movement+=d.movement?1:0;water+=d.water;meals+=d.meals;active+=d.hasAny?1:0}
    return {movement,water,meals,active};
  }
  function renderComparison(){
    const host=document.getElementById('weeklyDayList')?.parentElement;if(!host||host.querySelector('.weekly-compare'))return;
    const current=weekStats(0),previous=weekStats(-1);
    const card=document.createElement('div');card.className='card weekly-compare';
    const row=(label,a,b)=>{const diff=a-b,cls=diff>0?'up':diff<0?'down':'same',text=diff>0?`↑ ${diff} more`:diff<0?`↓ ${Math.abs(diff)} fewer`:'No change';return `<div class="compare-row"><span>${label}<small> ${a} this week · ${b} last week</small></span><b class="compare-change ${cls}">${text}</b></div>`};
    card.innerHTML=`<span class="eyebrow">Week to week</span><h3>Your gentle comparison</h3>${row('Active days',current.active,previous.active)}${row('Movement days',current.movement,previous.movement)}${row('Water bottles',current.water,previous.water)}${row('Meals completed',current.meals,previous.meals)}<p class="sub">This is information, not a score. A quieter week never erases your progress.</p>`;
    host.appendChild(card);
  }
  function applyPrefs(){
    const p=readPrefs(),root=document.documentElement;
    root.classList.toggle('rooted-large-text',!!p.largeText);root.classList.toggle('rooted-reduce-motion',!!p.reduceMotion);root.classList.toggle('rooted-high-contrast',!!p.highContrast);
    const map={settingLargeText:p.largeText,settingReduceMotion:p.reduceMotion,settingHighContrast:p.highContrast};Object.entries(map).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.checked=!!v});
  }
  function saveAccessibility(){
    savePrefs({largeText:!!document.getElementById('settingLargeText')?.checked,reduceMotion:!!document.getElementById('settingReduceMotion')?.checked,highContrast:!!document.getElementById('settingHighContrast')?.checked});applyPrefs();
    const b=document.getElementById('saveAccessibility');if(b){b.textContent='Saved ✓';setTimeout(()=>b.textContent='Save display preferences',1200)}
  }
  function markBackup(){localStorage.setItem(BACKUP_KEY,new Date().toISOString());renderBackupFreshness()}
  function renderBackupFreshness(){
    const card=document.getElementById('settingsExport')?.closest('.card');if(!card)return;
    let box=card.querySelector('.backup-freshness');if(!box){box=document.createElement('div');box.className='backup-freshness';card.appendChild(box)}
    const raw=localStorage.getItem(BACKUP_KEY);box.textContent=raw?`Last backup created ${new Date(raw).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}.`:'No backup recorded yet. Export one before changing phones or clearing browser data.';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    applyPrefs();renderBackupFreshness();renderComparison();
    document.getElementById('historyPrev')?.addEventListener('click',()=>{historyCursor.setMonth(historyCursor.getMonth()-1);renderHistory()});
    document.getElementById('historyNext')?.addEventListener('click',()=>{historyCursor.setMonth(historyCursor.getMonth()+1);renderHistory()});
    document.getElementById('saveAccessibility')?.addEventListener('click',saveAccessibility);
    document.getElementById('settingsExport')?.addEventListener('click',()=>setTimeout(markBackup,100));
    document.getElementById('exportBtn')?.addEventListener('click',()=>setTimeout(markBackup,100));
    document.addEventListener('rooted:pagechange',e=>{if(e.detail.pageId==='history'){renderHistory();if(!selectedHistoryDate){selectedHistoryDate=isoLocal(new Date());renderHistoryDetail(selectedHistoryDate)}}if(e.detail.pageId==='week')renderComparison();if(e.detail.pageId==='settings'){applyPrefs();renderBackupFreshness()}});
  });
})();
