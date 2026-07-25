
const {workouts}=window.APP_DATA;
const START=new Date(2026,6,27),DAYS=56,KEY='courtneyResetPremiumV5';
let previous=JSON.parse(localStorage.getItem('courtneyResetPremiumV4')||'null');
let state=JSON.parse(localStorage.getItem(KEY)||'null')||previous||{};
state={checks:{},water:{},mealDone:{},weights:{},notes:{},shopping:{},checkins:{},celebrated:{},dayMeals:{},leftovers:[],...state};
const $=x=>document.getElementById(x);

const recipes=[
{id:'skip',type:'Breakfast',name:'No breakfast today',icon:'☕',effort:'barely',category:'light',cal:0,protein:0,ingredients:[],method:'Breakfast is optional. Have water and eat when you are genuinely hungry.',weekday:true},
{id:'choc-oats',type:'Breakfast',name:'Chocolate overnight oats',icon:'🥣',effort:'easy',category:'oats',cal:390,protein:18,ingredients:['rolled oats','almond milk','chia seeds','small amount of chocolate chips','optional lactose-free yoghurt'],method:'Mix the night before and keep it lightly sweet.',weekday:true},
{id:'banana-oats',type:'Breakfast',name:'Banana overnight oats',icon:'🍌',effort:'easy',category:'oats',cal:370,protein:16,ingredients:['rolled oats','almond milk','banana','chia seeds'],method:'Mash in half a banana and keep the toppings simple.',weekday:true},
{id:'vegemite-toast',type:'Breakfast',name:'Vegemite toast',icon:'🍞',effort:'barely',category:'light',cal:240,protein:8,ingredients:['bread','Vegemite','dairy-free spread if needed'],method:'Quick, savoury and not too sweet.',weekday:true},
{id:'popcorn',type:'Snack',name:'Popcorn',icon:'🍿',effort:'barely',category:'snack',cal:140,protein:3,ingredients:['popcorn'],method:'Portion it into a bowl and enjoy it.',weekday:true},
{id:'fruit',type:'Snack',name:'Fruit',icon:'🍎',effort:'barely',category:'snack',cal:100,protein:1,ingredients:['fruit'],method:'Choose whatever you actually feel like eating.',weekday:true},
{id:'crackers',type:'Snack',name:'Plain crackers',icon:'🫓',effort:'barely',category:'snack',cal:180,protein:4,ingredients:['plain crackers'],method:'Add a small protein side only when it suits you.',weekday:true},

{id:'leftover-placeholder',type:'Lunch',name:'Leftovers from another day',icon:'🥡',effort:'barely',category:'leftovers',cal:450,protein:25,ingredients:[],method:'Pick a saved leftover serve from the fridge list.',weekday:true},
{id:'chicken-wrap',type:'Lunch',name:'Easy chicken wrap',icon:'🌯',effort:'easy',category:'quick',cal:480,protein:35,ingredients:['wraps','cooked chicken','lettuce','grated carrot','garlic-free dressing'],method:'Fill, roll and eat. No tomato.',weekday:true},
{id:'soup-lunch',type:'Lunch',name:'Chicken and corn soup',icon:'🌽',effort:'easy',category:'soup',cal:420,protein:34,ingredients:['chicken breast','corn','chicken stock','potato','carrot'],method:'Make a batch and save extra serves for lunches.',weekday:true},
{id:'pizza-scrolls',type:'Lunch',name:'Pizza scrolls',icon:'🍕',effort:'easy',category:'comfort',cal:520,protein:23,ingredients:['puff pastry','ham','lactose-free cheese if needed','tomato-free pizza base sauce'],method:'Use a tomato-free base such as a light BBQ-style sauce.',weekday:true},
{id:'empanadas',type:'Lunch',name:'Mince empanadas',icon:'🥟',effort:'easy',category:'comfort',cal:540,protein:28,ingredients:['lean mince','puff pastry','carrot','mild spices','egg for wash only'],method:'Egg is only used as a wash, not eaten by itself.',weekday:true},

{id:'spagbol',type:'Dinner',name:'Spaghetti bolognese — tomato free',icon:'🍝',effort:'easy',category:'pasta',cal:610,protein:38,ingredients:['lean mince','spaghetti','carrot','beef stock','pumpkin purée or tomato-free pasta sauce','optional garlic-infused oil'],method:'Keep garlic optional and make extra for leftovers.',weekday:true},
{id:'steak',type:'Dinner',name:'Steak with mash',icon:'🥩',effort:'cook',category:'steak',cal:620,protein:45,ingredients:['steak','potatoes','lactose-free or dairy-free milk','preferred side'],method:'A good weekend meal or a weekday meal when you have the energy.',weekday:false},
{id:'thai-pumpkin',type:'Dinner',name:'Thai chicken pumpkin soup',icon:'🥣',effort:'easy',category:'soup',cal:470,protein:38,ingredients:['chicken breast','pumpkin','coconut milk','red Thai curry paste','chicken stock'],method:'Use a garlic-light curry paste where possible. Great for batch cooking.',weekday:true},
{id:'honey-soy',type:'Dinner',name:'Honey soy chicken and rice',icon:'🍗',effort:'easy',category:'quick',cal:590,protein:42,ingredients:['chicken breast','rice','honey','soy sauce','carrot'],method:'One-pan chicken with rice. Skip fresh garlic.',weekday:true},
{id:'burger',type:'Dinner',name:'Homemade burger night',icon:'🍔',effort:'easy',category:'comfort',cal:650,protein:38,ingredients:['lean beef patty','burger buns','lettuce','lactose-free cheese if needed','potato wedges'],method:'No tomato and use garlic-free sauces.',weekday:true},
{id:'creamy-chicken-pasta',type:'Dinner',name:'Creamy chicken pasta',icon:'🍝',effort:'cook',category:'pasta',cal:640,protein:42,ingredients:['chicken breast','pasta','lactose-free cream or dairy-free cooking cream'],method:'A more energetic weekend meal.',weekday:false},
{id:'taco-bowl',type:'Dinner',name:'Taco bowl — no tomato',icon:'🌮',effort:'easy',category:'quick',cal:570,protein:36,ingredients:['lean mince','rice','corn','lettuce','lactose-free cheese optional','garlic-free mild seasoning'],method:'No tomato salsa.',weekday:true},
{id:'loaded-potato',type:'Dinner',name:'Loaded baked potato',icon:'🥔',effort:'easy',category:'comfort',cal:560,protein:30,ingredients:['potatoes','lean mince or chicken','corn','lactose-free cheese optional'],method:'Microwave first, then crisp it up.',weekday:true},
{id:'weekend-empanadas',type:'Dinner',name:'Homemade empanadas',icon:'🥟',effort:'cook',category:'comfort',cal:600,protein:32,ingredients:['lean mince','puff pastry','carrot','mild spices','egg for wash only'],method:'A weekend cook that creates handy leftovers.',weekday:false},

{id:'protein-snack',type:'Extra',name:'Protein snack plate',icon:'🥨',effort:'barely',category:'snack',cal:330,protein:22,ingredients:['plain crackers','sliced chicken or ham','lactose-free cheese if tolerated'],method:'A savoury top-up for days when breakfast is skipped.',weekday:true},
{id:'oats-topup',type:'Extra',name:'Small overnight oats',icon:'🥣',effort:'easy',category:'oats',cal:310,protein:15,ingredients:['rolled oats','almond milk','chia seeds','small amount of chocolate chips'],method:'Use a smaller portion than the breakfast oats.',weekday:true},
{id:'popcorn-plus',type:'Extra',name:'Popcorn and a protein side',icon:'🍿',effort:'barely',category:'snack',cal:270,protein:15,ingredients:['popcorn','sliced chicken or lactose-free yoghurt if tolerated'],method:'Your favourite snack with something filling beside it.',weekday:true},
{id:'toast-topup',type:'Extra',name:'Vegemite toast and fruit',icon:'🍞',effort:'barely',category:'light',cal:250,protein:8,ingredients:['bread','Vegemite','fruit'],method:'Savoury, quick and useful when the day is under target.',weekday:true}
];

const takeawayOptions=[
{name:'Burger and small chips',icon:'🍔',cal:800,protein:30},
{name:'Chicken burger or wrap',icon:'🍗',cal:700,protein:35},
{name:'Pizza',icon:'🍕',cal:850,protein:30},
{name:'Kebab',icon:'🥙',cal:750,protein:35},
{name:'Chinese meal',icon:'🥡',cal:800,protein:30},
{name:'Takeaway — don’t track',icon:'💚',cal:0,protein:0}
];

function dayNum(x){return Math.floor(new Date(x.getFullYear(),x.getMonth(),x.getDate(),12).getTime()/86400000)}
function status(){let e=dayNum(new Date())-dayNum(START);if(e<0)return{stage:'countdown',left:-e,week:1,day:0,n:0};if(e>=DAYS)return{stage:'complete',week:8,day:6,n:56};return{stage:'active',week:Math.floor(e/7)+1,day:e%7,n:e+1}}
const s=status(),w=s.week,d=s.day,work=workouts[d],dk=`w${w}d${d}`,weekday=d<5;
function persist(){localStorage.setItem(KEY,JSON.stringify(state))}
function save(){persist();render()}
function pct(n,t){return t?Math.round(n/t*100):0}
function phaseSets(base,i){return w>=5&&i<2?base+1:base}
function recipe(id){return recipes.find(r=>r.id===id)}
function cloneMeal(r){return JSON.parse(JSON.stringify(r))}

function calorieGuide(){return weekday?1600:1750}
function bestTopUpFor(total){
 const gap=calorieGuide()-total;
 if(gap<=80)return null;
 if(gap<=270)return cloneMeal(recipe('toast-topup'));
 if(gap<=320)return cloneMeal(recipe('popcorn-plus'));
 if(gap<=380)return cloneMeal(recipe('oats-topup'));
 return cloneMeal(recipe('protein-snack'));
}
function defaultDayMeals(day=d,week=w){
 const easyDinner=['thai-pumpkin','spagbol','honey-soy','burger','taco-bowl'];
 const weekendDinner=['steak','creamy-chicken-pasta'];
 const meals={Breakfast:cloneMeal(recipe(day===5?'choc-oats':day===6?'banana-oats':'skip')),
 Lunch:cloneMeal(recipe(day===0?'chicken-wrap':day===1?'leftover-placeholder':day===2?'soup-lunch':day===3?'leftover-placeholder':day===4?'pizza-scrolls':day===5?'empanadas':'soup-lunch')),
 Snack:cloneMeal(recipe(day%2?'fruit':'popcorn')),
 Dinner:cloneMeal(recipe(day<5?easyDinner[(week+day)%easyDinner.length]:weekendDinner[day-5]))};
 const total=Object.values(meals).reduce((a,m)=>a+(m?.cal||0),0);
 const topUp=bestTopUpFor(total);
 if(topUp){topUp.type='Extra';meals.Extra=topUp}
 return meals;
}
function selectedMeals(dayKey=dk){
 if(!state.dayMeals[dayKey])state.dayMeals[dayKey]=defaultDayMeals();
 const order=['Breakfast','Lunch','Snack','Dinner','Extra'];
 let list=order.map(t=>state.dayMeals[dayKey][t]).filter(Boolean);
 const total=list.reduce((a,m)=>a+(m.cal||0),0);
 if(!state.dayMeals[dayKey].Extra){
   const topUp=bestTopUpFor(total);
   if(topUp){topUp.type='Extra';state.dayMeals[dayKey].Extra=topUp;list.push(topUp);persist()}
 }
 return order.map(t=>state.dayMeals[dayKey][t]).filter(Boolean)
}
function mealFor(type){return selectedMeals().find(m=>m.type===type)}
function setMeal(type,meal){if(!state.dayMeals[dk])state.dayMeals[dk]=defaultDayMeals();state.dayMeals[dk][type]=cloneMeal(meal);state.dayMeals[dk][type].type=type;state.mealDone[`${dk}-${type}`]=false;save()}
function taskKeys(){let ks=[`${dk}-walk`];work.ex.forEach((e,i)=>{for(let n=1;n<=phaseSets(e.sets,i);n++)ks.push(`${dk}-ex${i}-set${n}`)});return ks}
function dailyPct(){let ks=taskKeys();return pct(ks.filter(k=>state.checks[k]).length,ks.length)}
function waterCount(){return[1,2,3,4,5].filter(i=>state.water[`${dk}-${i}`]).length}
function proteinData(){let list=selectedMeals(),done=list.filter(m=>state.mealDone[`${dk}-${m.type}`]);return{done:done.reduce((a,m)=>a+(m.protein||0),0),total:list.reduce((a,m)=>a+(m.protein||0),0)}}
function programProgress(){let done=0,total=0;for(let ww=1;ww<=8;ww++)for(let dd=0;dd<7;dd++){let wo=workouts[dd],k=`w${ww}d${dd}`;total++;if(state.checks[`${k}-walk`])done++;total++;if(wo.ex.every((e,i)=>Array.from({length:ww>=5&&i<2?e.sets+1:e.sets},(_,n)=>state.checks[`${k}-ex${i}-set${n+1}`]).every(Boolean)))done++}return pct(done,total)}
function setRing(el,val){el.style.background=`conic-gradient(var(--sage) ${val}%,#e2e5df ${val}%)`}
function renderHeader(){todayDate.textContent=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}
const coachMessages=['Today is about glutes, not punishment. Slow reps and good form will do more than rushing.','Strong arms and a strong back make everyday life easier.','Move gently today. Pilates should feel controlled, not frantic.','Second glute day — make every rep count.','Finish the week feeling capable, not destroyed.','Put on an audiobook and make the long walk enjoyable.','Recovery is part of the plan. Be proud of the week.'];

function renderToday(){
 if(s.stage==='countdown')countdownCard.innerHTML=`<span class="eyebrow light">Your reset begins</span><h2>Monday 27 July</h2><div class="countdown">${s.left} ${s.left===1?'day':'days'}</div><p>Your first workout and easy Monday meal plan are ready.</p>`;
 else if(s.stage==='complete')countdownCard.innerHTML='<h2>Eight weeks complete 🎉</h2><p>Take your final measurements and celebrate everything you achieved.</p>';
 else countdownCard.innerHTML=`<span class="eyebrow light">Day ${s.n} of 56</span><h2>Good ${new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, Courtney</h2><p>${work.icon} Week ${w} · ${work.day} · ${work.focus}</p>`;
 let dp=dailyPct(),wc=waterCount(),pd=proteinData();movePct.textContent=dp+'%';waterPct.textContent=pct(wc,4)+'%';proteinPct.textContent=pct(pd.done,pd.total)+'%';setRing(moveRing,dp);setRing(waterRing,pct(wc,4));setRing(proteinRing,pct(pd.done,pd.total));
 focusTitle.textContent=`${work.icon} ${work.focus}`;dayBadge.textContent=`Week ${w}`;
 todayQuick.innerHTML=[['walk',`${work.walk} min walking pad`],['water','Drink at least 2 L water'],['protein','Include protein with meals'],['stretch','Complete your stretch']].map(([x,t])=>`<label class="quick"><input type="checkbox" data-quick="${x}" ${quickDone(x)?'checked':''}><b>${t}</b></label>`).join('');
 document.querySelectorAll('[data-quick]').forEach(x=>x.onchange=()=>quickToggle(x.dataset.quick,x.checked));streak.textContent=calcStreak()+' days';programPct.textContent=programProgress()+'%';coachText.textContent=s.stage==='countdown'?'Your Monday plan is ready.':coachMessages[d];
 renderNutritionSummary();
 mealPreview.innerHTML=selectedMeals().map(m=>`<div class="meal-mini"><div><b>${m.type}</b><small>${m.icon||'🍽️'} ${m.name}</small></div><span>${m.protein||0}g protein</span></div>`).join('')
}
function quickDone(x){if(x==='walk')return !!state.checks[`${dk}-walk`];if(x==='water')return waterCount()>=4;if(x==='protein')return selectedMeals().filter(m=>state.mealDone[`${dk}-${m.type}`]).length>=3;if(x==='stretch')return !!state.checks[`${dk}-stretch`]}
function quickToggle(x,v){if(x==='walk')state.checks[`${dk}-walk`]=v;if(x==='water')for(let i=1;i<=4;i++)state.water[`${dk}-${i}`]=v;if(x==='protein')selectedMeals().forEach(m=>state.mealDone[`${dk}-${m.type}`]=v);if(x==='stretch')state.checks[`${dk}-stretch`]=v;save()}
function renderWorkout(){workoutDay.textContent=`Week ${w} · ${work.day}`;workoutTitle.textContent=`${work.icon} ${work.focus}`;walkTitle.textContent=`${work.walk} minute walking-pad walk`;walkDone.checked=!!state.checks[`${dk}-walk`];walkDone.onchange=()=>{state.checks[`${dk}-walk`]=walkDone.checked;celebrate();save()};
 exerciseList.innerHTML=work.ex.map((e,i)=>{let sets=phaseSets(e.sets,i);return`<article class="exercise-card"><div class="exercise-head"><div><h3>${e.name}</h3><div class="exercise-meta">${sets} sets · ${e.reps} · ${e.rest?e.rest+' sec rest':'no timer'}</div></div><button class="text-btn guide-btn" data-ex="${i}">How to</button></div><div class="sets">${Array.from({length:sets},(_,n)=>`<label class="set-pill"><input class="set-check" type="checkbox" data-set="${i}-${n+1}" ${state.checks[`${dk}-ex${i}-set${n+1}`]?'checked':''}>Set ${n+1}</label>`).join('')}</div><div class="weight-row"><label>Weight used<input type="text" data-weight="${i}" value="${state.weights[`${dk}-${i}`]||''}" placeholder="e.g. 5 kg"></label><label>Reps completed<input type="text" data-reps="${i}" value="${state.weights[`${dk}-${i}-reps`]||''}" placeholder="e.g. 10, 10, 9"></label></div><div class="exercise-actions"><button class="outline timer-btn" data-seconds="${e.rest||45}">Rest timer</button><button class="outline guide-btn" data-ex="${i}">Technique</button></div></article>`}).join('');
 document.querySelectorAll('[data-set]').forEach(x=>x.onchange=()=>{let[a,b]=x.dataset.set.split('-');state.checks[`${dk}-ex${a}-set${b}`]=x.checked;celebrate();save()});document.querySelectorAll('[data-weight]').forEach(x=>x.oninput=()=>{state.weights[`${dk}-${x.dataset.weight}`]=x.value;persist()});document.querySelectorAll('[data-reps]').forEach(x=>x.oninput=()=>{state.weights[`${dk}-${x.dataset.reps}-reps`]=x.value;persist()});document.querySelectorAll('.guide-btn').forEach(x=>x.onclick=()=>openGuide(work.ex[x.dataset.ex]));document.querySelectorAll('.timer-btn').forEach(x=>x.onclick=()=>openTimer(+x.dataset.seconds));workoutNotes.value=state.notes[dk]||'';workoutNotes.oninput=()=>{state.notes[dk]=workoutNotes.value;persist()}}
function mealCard(m){let done=state.mealDone[`${dk}-${m.type}`],macro=m.noTrack?'<span class="soft-badge">No tracking tonight</span>':`${m.cal||0} calories · ${m.protein||0}g protein`,ingredients=(m.ingredients||[]).map(x=>`<span class="chip">${x}</span>`).join(''),cooked=(m.type==='Dinner'||m.type==='Lunch')&&!m.isLeftover&&!m.isTakeaway&&m.id!=='skip'?`<button class="outline cooked-btn" data-cooked="${m.type}">Cooked it + save leftovers</button>`:'';return`<article class="meal-card ${m.isTakeaway?'takeaway-card':''}"><div class="meal-top"><div><span class="eyebrow">${m.type}</span><h3>${m.icon||'🍽️'} ${m.name}</h3></div><input class="meal-check" type="checkbox" data-mealdone="${m.type}" ${done?'checked':''}></div><div class="macro">${macro}</div>${ingredients?`<div class="ingredients">${ingredients}</div>`:''}<p class="sub meal-method">${m.method||''}</p><div class="meal-actions"><button class="outline choose-one" data-type="${m.type}">Change</button>${cooked}</div></article>`}

function nutritionTotals(){
 const list=selectedMeals();
 const planned=list.reduce((a,m)=>a+(m.cal||0),0);
 const protein=list.reduce((a,m)=>a+(m.protein||0),0);
 const guide=calorieGuide();
 return {list,planned,protein,guide,remaining:guide-planned};
}
function renderNutritionSummary(){
 const n=nutritionTotals();
 calTotal.textContent=n.planned;
 proteinTotal.textContent=n.protein+'g';
 waterTotal.textContent=(waterCount()*.5).toFixed(1)+'L';
 calorieGoal.textContent=n.guide;
 calorieRemaining.textContent=n.remaining>0?n.remaining:0;
 const ratio=Math.min(100,Math.round(n.planned/n.guide*100));
 calorieProgressBar.style.width=ratio+'%';
 const status=n.planned<1400
   ?'A little low for your normal plan.'
   :n.planned<=n.guide+150
     ?'Right on track for a steady, realistic day.'
     :'A bigger day—and that is completely okay.';
 nutritionStatus.textContent=status;
 lowCaloriePrompt.hidden=n.planned>=1400;
 lowCalorieText.textContent=`You have ${Math.max(0,n.guide-n.planned)} calories available. Add something filling rather than finishing the day hungry.`;
 if(typeof todayPlannedCalories!=='undefined'){
   todayPlannedCalories.textContent=n.planned;
   todayCaloriesLeft.textContent=n.remaining>0?`${n.remaining} left`:'goal reached';
   todayCalorieBar.style.width=ratio+'%';
   todayNutritionMessage.textContent=status;
 }
}
function renderMeals(){
 let list=selectedMeals();
 renderNutritionSummary();
 dayStyleNote.textContent=weekday?'Monday–Friday is Easy Mode: quick meals and fresh leftovers are prioritised.':'Weekend mode: you have room for a meal that takes a little more energy.';
 mealList.innerHTML=list.map(mealCard).join('');
 document.querySelectorAll('[data-mealdone]').forEach(x=>x.onchange=()=>{state.mealDone[`${dk}-${x.dataset.mealdone}`]=x.checked;save()});
 document.querySelectorAll('.choose-one').forEach(x=>x.onclick=()=>openMealPicker(x.dataset.type));
 document.querySelectorAll('.cooked-btn').forEach(x=>x.onclick=()=>saveLeftovers(x.dataset.cooked));
 waterGrid.innerHTML=Array.from({length:5},(_,i)=>`<button class="water-btn ${state.water[`${dk}-${i+1}`]?'done':''}" data-water="${i+1}">${(i+1)*500}<small>mL</small></button>`).join('');
 document.querySelectorAll('[data-water]').forEach(x=>x.onclick=()=>{state.water[`${dk}-${x.dataset.water}`]=!state.water[`${dk}-${x.dataset.water}`];save()});
 renderLeftovers();
}
function renderLeftovers(){let total=state.leftovers.reduce((a,x)=>a+x.serves,0);leftoverCount.textContent=`${total} ${total===1?'serve':'serves'}`;leftoverShelf.innerHTML=state.leftovers.length?state.leftovers.map((x,i)=>`<div class="leftover-row"><div><b>🥡 ${x.name}</b><small>${x.serves} ${x.serves===1?'serve':'serves'} left</small></div><button class="text-btn" data-remove-leftover="${i}">Remove</button></div>`).join(''):'<p class="empty">Nothing saved yet. Tap “Cooked it + save leftovers” after making a meal.</p>';document.querySelectorAll('[data-remove-leftover]').forEach(x=>x.onclick=()=>{state.leftovers.splice(+x.dataset.removeLeftover,1);save()})}
function saveLeftovers(type){let m=mealFor(type),serves=parseInt(prompt(`How many leftover serves of ${m.name} are going into the fridge?`,'2'),10);if(!serves||serves<1)return;let existing=state.leftovers.find(x=>x.name===m.name);if(existing)existing.serves+=serves;else state.leftovers.push({name:m.name,serves,cal:m.cal,protein:m.protein,icon:m.icon});save()}
function openMealPicker(type='Dinner'){pickerMealType.value=type;pickerEffort.value=weekday?'easy':'cook';buildCravings('all');mealPickerModal.showModal()}
function buildCravings(active){let cats=[['all','✨','All'],['quick','🌯','Quick'],['pasta','🍝','Pasta'],['soup','🥣','Soup'],['steak','🥩','Steak'],['comfort','🍔','Comfort'],['oats','🥣','Oats'],['light','☕','Light'],['snack','🍿','Snack']];cravingGrid.innerHTML=cats.map(([id,ic,n])=>`<button class="craving ${active===id?'active':''}" data-craving="${id}"><span>${ic}</span>${n}</button>`).join('');document.querySelectorAll('[data-craving]').forEach(x=>x.onclick=()=>buildCravings(x.dataset.craving));renderRecipeChoices(active)}
function renderRecipeChoices(category='all'){let type=pickerMealType.value,effort=pickerEffort.value,list=recipes.filter(r=>r.type===type&&(category==='all'||r.category===category));if(effort==='barely')list=list.filter(r=>r.effort==='barely'||r.effort==='easy');if(effort==='easy')list=list.filter(r=>r.effort!=='cook');if(weekday)list.sort((a,b)=>(b.weekday?1:0)-(a.weekday?1:0));recipeChoices.innerHTML=list.length?list.map(r=>`<button class="recipe-choice" data-recipe="${r.id}"><span>${r.icon}</span><div><b>${r.name}</b><small>${r.effort==='cook'?'More energy':'Easy'} · ${r.protein}g protein</small></div></button>`).join(''):'<p class="empty">No matches—try a different craving or effort level.</p>';document.querySelectorAll('[data-recipe]').forEach(x=>x.onclick=()=>{setMeal(pickerMealType.value,recipe(x.dataset.recipe));mealPickerModal.close()})}
function openLeftovers(){leftoverMealType.value='Dinner';leftoverChoices.innerHTML=state.leftovers.length?state.leftovers.map((x,i)=>`<button class="recipe-choice" data-use-leftover="${i}"><span>${x.icon||'🥡'}</span><div><b>${x.name}</b><small>${x.serves} ${x.serves===1?'serve':'serves'} left</small></div></button>`).join(''):'<p class="empty">You don’t have any saved leftovers yet.</p>';document.querySelectorAll('[data-use-leftover]').forEach(x=>x.onclick=()=>{let i=+x.dataset.useLeftover,item=state.leftovers[i];if(!state.dayMeals[dk])state.dayMeals[dk]=defaultDayMeals();state.dayMeals[dk][leftoverMealType.value]={id:'leftover',type:leftoverMealType.value,name:`Leftover ${item.name}`,icon:'🥡',cal:item.cal,protein:item.protein,ingredients:[],method:'Heat it through and enjoy not having to cook.',isLeftover:true};item.serves--;if(item.serves<=0)state.leftovers.splice(i,1);leftoverModal.close();save()});leftoverModal.showModal()}
function openTakeaway(){takeawayChoices.innerHTML=takeawayOptions.map((x,i)=>`<button class="takeaway-choice" data-takeaway="${i}"><span>${x.icon}</span><b>${x.name}</b></button>`).join('');document.querySelectorAll('[data-takeaway]').forEach(x=>x.onclick=()=>saveTakeaway(takeawayOptions[+x.dataset.takeaway]));customTakeaway.value='';takeawayModal.showModal()}
function saveTakeaway(choice,forceNoTrack=false){let name=choice?.name||customTakeaway.value.trim();if(!name)return;let noTrack=forceNoTrack||choice?.name.includes('don’t track');setMeal(takeawayMealType.value,{id:'takeaway',name,icon:choice?.icon||'🛍️',cal:noTrack?0:(choice?.cal||700),protein:noTrack?0:(choice?.protein||25),ingredients:[],method:'Enjoy it. Tomorrow continues normally—no punishment workout and no skipping meals to make up for it.',isTakeaway:true,noTrack});takeawayModal.close()}
function tooTired(){if(state.leftovers.length){openLeftovers();return}setMeal('Dinner',recipe('loaded-potato'));alert('Tonight is sorted: loaded baked potato.')}
function skipBreakfast(){setMeal('Breakfast',recipe('skip'))}
function planForDay(dd){let k=`w${w}d${dd}`;return state.dayMeals[k]?Object.values(state.dayMeals[k]):Object.values(defaultDayMeals(dd,w))}
function weeklyIngredients(){let set=new Set;for(let dd=0;dd<7;dd++)planForDay(dd).forEach(m=>{if(!m.isTakeaway&&!m.isLeftover)(m.ingredients||[]).forEach(x=>set.add(x))});return[...set].sort()}
function renderShop(){let groups={'Weekly groceries':weeklyIngredients(),'Your equipment':['Dumbbells','Walking pad','Yoga mat']};shoppingList.innerHTML=Object.entries(groups).map(([g,items])=>`<section class="shop-group"><h3>${g}</h3>${items.map(x=>`<label class="shop-row"><input class="shop-check" type="checkbox" data-shop="${x}" ${state.shopping[x]?'checked':''}><span>${x}</span></label>`).join('')}</section>`).join('');document.querySelectorAll('[data-shop]').forEach(x=>x.onchange=()=>{state.shopping[x.dataset.shop]=x.checked;persist()})}
function renderProgress(){progressWeek.textContent=`Week ${w}`;let checks=Object.keys(state.checks).filter(k=>state.checks[k]);workoutsDone.textContent=checks.filter(k=>k.endsWith('-walk')).length;exercisesDone.textContent=checks.filter(k=>k.includes('-ex')).length;renderChart();let ach=[['🌱','First step',checks.length>0],['🔥','3-day streak',calcStreak()>=3],['💧','Hydrated',waterCount()>=4],['🥡','Leftover lover',state.leftovers.length>0],['💚','Real life win',selectedMeals().some(m=>m.isTakeaway||m.isLeftover)],['🏆','8 weeks',programProgress()===100]];achievements.innerHTML=ach.map(a=>`<div class="achievement ${a[2]?'unlocked':''}"><span>${a[0]}</span><b>${a[1]}</b></div>`).join('')}
function renderChart(){let pts=Object.entries(state.checkins).filter(([,x])=>x.weight).sort((a,b)=>+a[0]-+b[0]);chartEmpty.style.display=pts.length?'none':'block';weightChart.innerHTML='';if(!pts.length)return;let vals=pts.map(x=>+x[1].weight),mn=Math.min(...vals)-1,mx=Math.max(...vals)+1,coords=pts.map(([ww,x],i)=>[40+i*(520/Math.max(1,pts.length-1)),190-(+x.weight-mn)/(mx-mn)*150]);weightChart.innerHTML=`<line x1="40" y1="190" x2="560" y2="190" stroke="#d8d3ca"/><polyline points="${coords.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#5f715a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${coords.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#7f9079"/><text x="${p[0]}" y="${p[1]-14}" text-anchor="middle" font-size="14">${vals[i]}kg</text><text x="${p[0]}" y="212" text-anchor="middle" font-size="12">W${pts[i][0]}</text>`).join('')}`}
function calcStreak(){let n=0;for(let ww=1;ww<=w;ww++)for(let dd=0;dd<7;dd++){if(ww===w&&dd>d)break;let k=`w${ww}d${dd}`;if(state.checks[`${k}-walk`])n++;else if(!(ww===w&&dd===d))n=0}return n}
function openGuide(e){modalTitle.textContent=e.name;modalHow.textContent=e.how;modalEasy.textContent=e.easy;modalHard.textContent=e.hard;exerciseVideoLink.href='https://www.youtube.com/results?search_query='+encodeURIComponent(e.name+' proper form beginner');exerciseModal.showModal()}
let timer=60,timerInt=null;function openTimer(n){timer=n;timerValue.textContent=timer;timerToggle.textContent='Start';clearInterval(timerInt);timerModal.showModal()}function timerTick(){if(timer<=0){clearInterval(timerInt);timerInt=null;timerToggle.textContent='Start';navigator.vibrate?.(200);return}timer--;timerValue.textContent=timer}
function celebrate(){if(dailyPct()===100&&!state.celebrated[dk]){state.celebrated[dk]=true;for(let i=0;i<45;i++){let p=document.createElement('i');p.className='confetti-piece';p.style.left=Math.random()*100+'%';p.style.background=['#7f9079','#b89655','#b46f72','#d8c5a5'][i%4];p.style.animationDelay=Math.random()*.6+'s';confetti.appendChild(p);setTimeout(()=>p.remove(),2500)}}}
function render(){renderHeader();renderToday();renderWorkout();renderMeals();renderShop();renderProgress();persist()}
function go(id){document.querySelectorAll('.page,.nav').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');document.querySelector(`.nav[data-go="${id}"]`)?.classList.add('active');scrollTo(0,0)}
document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>go(x.dataset.go));document.querySelectorAll('.modal-close').forEach(x=>x.onclick=()=>x.closest('dialog').close());
swapAll.onclick=()=>{state.dayMeals[dk]=defaultDayMeals(d,w);save()};clearShop.onclick=()=>{state.shopping={};save()};chooseMealBtn.onclick=()=>openMealPicker('Dinner');leftoversBtn.onclick=openLeftovers;takeawayBtn.onclick=openTakeaway;tooTiredBtn.onclick=tooTired;skipBreakfastBtn.onclick=skipBreakfast;pickerMealType.onchange=()=>buildCravings('all');pickerEffort.onchange=()=>buildCravings('all');takeawaySave.onclick=()=>saveTakeaway(null,false);takeawayNoTrack.onclick=()=>saveTakeaway(null,true);
saveCheckin.onclick=()=>{state.checkins[w]={weight:weight.value,waist:waist.value,hips:hips.value,energy:energy.value,win:win.value};save();alert('Week '+w+' saved')};exportBtn.onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='courtney-reset-backup-v5.json';a.click()};importFile.onchange=async()=>{try{state=JSON.parse(await importFile.files[0].text());save()}catch{alert('That file could not be read')}};resetBtn.onclick=()=>{if(confirm('Reset all progress?')){localStorage.removeItem(KEY);location.reload()}};
timerToggle.onclick=()=>{if(timerInt){clearInterval(timerInt);timerInt=null;timerToggle.textContent='Start'}else{timerInt=setInterval(timerTick,1000);timerToggle.textContent='Pause'}};timerMinus.onclick=()=>{timer=Math.max(0,timer-15);timerValue.textContent=timer};timerPlus.onclick=()=>{timer+=15;timerValue.textContent=timer};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=7').catch(()=>{}));render();


// --- Version 6.2 practical upgrades ---
(() => {
  const KEY = 'courtneyResetV62';
  const state = JSON.parse(localStorage.getItem(KEY) || '{"mode":"normal","walks":[],"weights":{},"leftovers":[]}');
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  // Energy modes
  const modeMessages = {
    normal: 'Your full workout is ready.',
    low: 'Low-energy mode: complete 2 sets instead of 3 and shorten the walk by 10 minutes.',
    sore: 'Sore-day mode: skip strength work and do a gentle walk plus 10 minutes of mobility.',
    skip: 'Rest today. Nothing is lost—just continue with the next day tomorrow.'
  };
  const applyMode = (mode) => {
    state.mode = mode; save();
    document.querySelectorAll('.mode-card').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    const msg = document.getElementById('modeMessage');
    if (msg) msg.textContent = modeMessages[mode];
    document.body.dataset.workoutMode = mode;
    document.querySelectorAll('.exercise-card, .exercise').forEach((card) => {
      card.classList.remove('low-energy-muted','sore-hidden','rest-hidden');
      if (mode === 'low') card.classList.add('low-energy-muted');
      if (mode === 'sore') card.classList.add('sore-hidden');
      if (mode === 'skip') card.classList.add('rest-hidden');
    });
  };
  document.querySelectorAll('.mode-card').forEach(b => b.addEventListener('click', () => applyMode(b.dataset.mode)));
  applyMode(state.mode || 'normal');

  // Walking pad log
  const renderWalkSummary = () => {
    const el = document.getElementById('walkSummary');
    if (!el) return;
    const recent = state.walks.slice(-7);
    const mins = recent.reduce((n,w)=>n+(Number(w.minutes)||0),0);
    const km = recent.reduce((n,w)=>n+(Number(w.distance)||0),0);
    el.textContent = recent.length ? `Last 7 logged walks: ${mins} minutes • ${km.toFixed(1)} km` : 'No walks logged yet.';
  };
  document.getElementById('saveWalkBtn')?.addEventListener('click', () => {
    const minutes = Number(document.getElementById('walkMinutes')?.value || 0);
    const speed = Number(document.getElementById('walkSpeed')?.value || 0);
    const distance = Number(document.getElementById('walkDistance')?.value || 0);
    if (!minutes && !distance) { alert('Add your minutes or distance first.'); return; }
    state.walks.push({date:new Date().toISOString().slice(0,10), minutes, speed, distance});
    save(); renderWalkSummary();
    ['walkMinutes','walkSpeed','walkDistance'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  });
  renderWalkSummary();

  // Dumbbell weight memory in exercise modal
  let currentExercise = '';
  const oldOpenGuide = window.openGuide;
  if (typeof oldOpenGuide === 'function') {
    window.openGuide = function(e) {
      currentExercise = e?.name || '';
      oldOpenGuide(e);
      const input = document.getElementById('exerciseWeight');
      const label = document.getElementById('lastExerciseWeight');
      const saved = state.weights[currentExercise];
      if (input) input.value = '';
      if (label) label.textContent = saved ? `Last used: ${saved} kg` : 'No weight saved yet.';
    };
  }
  document.getElementById('saveExerciseWeight')?.addEventListener('click', () => {
    const value = Number(document.getElementById('exerciseWeight')?.value || 0);
    if (!currentExercise || !value) { alert('Enter the dumbbell weight first.'); return; }
    state.weights[currentExercise] = value;
    save();
    const label = document.getElementById('lastExerciseWeight');
    if (label) label.textContent = `Saved: ${value} kg`;
  });

  // Fridge leftovers
  const daysOld = (iso) => Math.floor((Date.now() - new Date(iso+'T12:00:00').getTime()) / 86400000);
  const renderLeftovers = () => {
    const list = document.getElementById('leftoverList');
    if (!list) return;
    if (!state.leftovers.length) {
      list.innerHTML = '<p class="empty-state">Nothing waiting in the fridge.</p>';
      return;
    }
    list.innerHTML = state.leftovers.map((x,i) => {
      const age = daysOld(x.cooked);
      const status = age <= 0 ? 'Cooked today' : age === 1 ? 'Eat today or tomorrow' : age === 2 ? 'Best eaten today' : 'Check before eating';
      return `<article class="leftover-card">
        <div><b>${x.name}</b><small>${x.serves} serve${x.serves===1?'':'s'} • ${status}</small></div>
        <div class="leftover-actions">
          <button data-use-leftover="${i}" class="secondary">Use 1</button>
          <button data-remove-leftover="${i}" class="ghost">Remove</button>
        </div>
      </article>`;
    }).join('');
  };
  document.getElementById('addLeftoverBtn')?.addEventListener('click', () => {
    const name = document.getElementById('leftoverName')?.value.trim();
    const serves = Number(document.getElementById('leftoverServes')?.value || 0);
    const cooked = document.getElementById('leftoverCooked')?.value || new Date().toISOString().slice(0,10);
    if (!name || !serves) { alert('Add the meal name and number of serves.'); return; }
    state.leftovers.push({name, serves, cooked});
    save(); renderLeftovers();
    document.getElementById('leftoverName').value='';
    document.getElementById('leftoverServes').value='';
  });
  document.addEventListener('click', (e) => {
    const use = e.target.closest('[data-use-leftover]');
    const remove = e.target.closest('[data-remove-leftover]');
    if (use) {
      const i = Number(use.dataset.useLeftover);
      state.leftovers[i].serves -= 1;
      if (state.leftovers[i].serves <= 0) state.leftovers.splice(i,1);
      save(); renderLeftovers();
    }
    if (remove) {
      state.leftovers.splice(Number(remove.dataset.removeLeftover),1);
      save(); renderLeftovers();
    }
  });
  renderLeftovers();
})();

// Version 7 nutrition controls
document.getElementById('addTopUpBtn')?.addEventListener('click',()=>{
  if(!state.dayMeals[dk])state.dayMeals[dk]=defaultDayMeals();
  const current=selectedMeals().filter(m=>m.type!=='Extra').reduce((a,m)=>a+(m.cal||0),0);
  const topUp=bestTopUpFor(current)||cloneMeal(recipe('toast-topup'));
  topUp.type='Extra';
  state.dayMeals[dk].Extra=topUp;
  save();
});

// Rooted foundation UI
window.addEventListener('load',()=>{
  const splash=document.getElementById('rootedSplash');
  if(splash){
    setTimeout(()=>splash.classList.add('hide'),900);
    setTimeout(()=>splash.remove(),1500);
  }
  document.querySelectorAll('[data-focus-go]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=btn.dataset.focusGo;
      const nav=document.querySelector(`[data-page="${target}"], [data-go="${target}"]`);
      if(nav) nav.click();
    });
  });
  renderRooted();
});

function rootedHabitScore(){
  let score=0;
  try{
    const meals=selectedMeals();
    const mealDoneCount=meals.filter(m=>state.mealDone?.[`${dk}-${m.type}`]).length;
    if(mealDoneCount>=2) score++;
    if(waterCount()>=5) score++;
    const workoutDone=!!(state.completedWorkouts?.[dk] || state.workoutDone?.[dk]);
    if(workoutDone) score++;
    const walk=state.walking?.[dk] || state.walkLogs?.[dk];
    if((walk?.minutes||0)>=20) score++;
  }catch(e){}
  return score;
}

function totalRootedChoices(){
  let total=0;
  try{
    total += Object.values(state.water||{}).filter(Boolean).length;
    total += Object.values(state.mealDone||{}).filter(Boolean).length;
    total += Object.values(state.completedWorkouts||{}).filter(Boolean).length;
    total += Object.values(state.workoutDone||{}).filter(Boolean).length;
    total += Object.values(state.walking||{}).filter(v=>(v?.minutes||0)>0).length;
    total += Object.values(state.walkLogs||{}).filter(v=>(v?.minutes||0)>0).length;
  }catch(e){}
  return total;
}

function renderRooted(){
  const today=rootedHabitScore();
  const total=totalRootedChoices();
  const waterLit=typeof waterCount==='function'?waterCount():0;
  const stages=[
    {min:0,icon:'🌱',name:'Seedling'},
    {min:12,icon:'🌿',name:'Taking root'},
    {min:35,icon:'🪴',name:'Growing strong'},
    {min:80,icon:'🌳',name:'Deeply rooted'}
  ];
  let stage=stages[0];
  stages.forEach(s=>{if(total>=s.min)stage=s});
  const next=stages.find(s=>s.min>total);
  const pct=next?Math.min(100,Math.round((total-stage.min)/(next.min-stage.min)*100)):100;

  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
  set('plantStageIcon',stage.icon);
  set('plantGrowthText',today===4?'Flourishing':today>=2?'Growing':'Beginning');
  set('plantVisual',stage.icon);
  set('plantStageName',stage.name);
  set('rootProgressLabel',`${total} healthy choices logged`);
  const bar=document.getElementById('rootProgressBar'); if(bar)bar.style.width=pct+'%';
  set('hydrateFocusText',`${(waterLit*.5).toFixed(1)} of 2.5 L`);

  const complete='✓', open='○';
  const workoutDone=!!(state.completedWorkouts?.[dk] || state.workoutDone?.[dk]);
  set('moveFocusState',workoutDone?complete:open);
  set('hydrateFocusState',waterLit>=5?complete:open);
  let mealDone=false;
  try{mealDone=selectedMeals().filter(m=>state.mealDone?.[`${dk}-${m.type}`]).length>=2}catch(e){}
  set('nourishFocusState',mealDone?complete:open);
  set('recoverFocusState',open);
}

const originalSave = typeof save==='function' ? save : null;
if(originalSave){
  save = function(){
    const result=originalSave.apply(this,arguments);
    setTimeout(renderRooted,0);
    return result;
  }
}

// Rooted Build 2: onboarding, progress rings and Today's Root
const ROOTED_PROFILE_KEY='rooted-profile-v2';
const ROOTED_ROOTS_KEY='rooted-daily-roots-v2';

function rootedProfile(){
  try{return JSON.parse(localStorage.getItem(ROOTED_PROFILE_KEY))||null}catch(e){return null}
}
function saveRootedProfile(profile){
  localStorage.setItem(ROOTED_PROFILE_KEY,JSON.stringify(profile));
}
function rootedDailyRoots(){
  try{return JSON.parse(localStorage.getItem(ROOTED_ROOTS_KEY))||{}}catch(e){return {}}
}
function rootedTodayKey(){
  return new Date().toISOString().slice(0,10);
}

function setupRootedOnboarding(){
  const shell=document.getElementById('rootedOnboarding');
  if(!shell)return;
  const profile=rootedProfile();
  if(!profile){
    shell.hidden=false;
    requestAnimationFrame(()=>shell.classList.add('show'));
  }

  let step=1;
  const showStep=n=>{
    step=Math.max(1,Math.min(4,n));
    shell.querySelectorAll('.onboarding-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));
    shell.querySelectorAll('.onboarding-dots span').forEach((dot,i)=>dot.classList.toggle('active',i===step-1));
  };
  shell.querySelectorAll('.onboarding-next').forEach(btn=>btn.addEventListener('click',()=>showStep(step+1)));
  shell.querySelectorAll('.onboarding-back').forEach(btn=>btn.addEventListener('click',()=>showStep(step-1)));
  shell.querySelectorAll('[data-choice-group]').forEach(btn=>btn.addEventListener('click',()=>{
    shell.querySelectorAll(`[data-choice-group="${btn.dataset.choiceGroup}"]`).forEach(x=>x.classList.remove('selected'));
    btn.classList.add('selected');
  }));
  shell.querySelectorAll('[data-toggle-choice]').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('selected')));

  const finish=()=>{
    const goal=shell.querySelector('[data-choice-group="goal"].selected')?.dataset.choice||'Feel healthier';
    const equipment={};
    shell.querySelectorAll('[data-toggle-choice].selected').forEach(x=>equipment[x.dataset.toggleChoice]=true);
    const profile={
      name:document.getElementById('onboardName')?.value.trim()||'Courtney',
      goal,
      equipment,
      walkGoal:Number(document.getElementById('onboardWalkGoal')?.value||30),
      waterGoal:Number(document.getElementById('onboardWaterGoal')?.value||2.5),
      completedAt:new Date().toISOString()
    };
    saveRootedProfile(profile);
    shell.classList.remove('show');
    setTimeout(()=>shell.hidden=true,350);
    renderRootedPremium();
  };
  document.getElementById('finishOnboarding')?.addEventListener('click',finish);
  document.getElementById('skipOnboarding')?.addEventListener('click',()=>{
    saveRootedProfile({name:'Courtney',goal:'Feel healthier',equipment:{dumbbells:true,walkingPad:true,yogaMat:true},walkGoal:30,waterGoal:2.5,completedAt:new Date().toISOString()});
    shell.classList.remove('show');
    setTimeout(()=>shell.hidden=true,350);
    renderRootedPremium();
  });
}

function getWalkMinutesToday(){
  try{
    const walk=state.walking?.[dk]||state.walkLogs?.[dk]||{};
    return Number(walk.minutes||0);
  }catch(e){return 0}
}

function setRing(id,pct){
  const el=document.getElementById(id);
  if(el)el.style.setProperty('--progress',Math.max(0,Math.min(100,pct)));
}

function renderRootedPremium(){
  const profile=rootedProfile()||{name:'Courtney',walkGoal:30,waterGoal:2.5};
  const hour=new Date().getHours();
  const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  const dateLabel=new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};

  set('rootedGreeting',`${greeting}, ${profile.name}.`);
  set('rootedDateLabel',dateLabel);
  set('rootedDailyLine','Today is another chance to grow.');

  let planned=0,guide=1600;
  try{
    const totals=nutritionTotals();
    planned=totals.planned||0;
    guide=totals.guide||1600;
  }catch(e){}
  const waterLit=(typeof waterCount==='function'?waterCount():0)*0.5;
  const walkMinutes=getWalkMinutesToday();

  set('ringCalories',planned);
  set('ringCaloriesSub',`of ${guide.toLocaleString('en-AU')}`);
  set('ringWater',waterLit.toFixed(1));
  set('ringWaterSub',`of ${profile.waterGoal} L`);
  set('ringWalk',walkMinutes);
  set('ringWalkSub',`of ${profile.walkGoal} min`);

  setRing('calorieRing',planned/guide*100);
  setRing('waterRing',waterLit/profile.waterGoal*100);
  setRing('walkRing',walkMinutes/profile.walkGoal*100);

  const total=typeof totalRootedChoices==='function'?totalRootedChoices():0;
  const heroPlant=document.getElementById('heroPlant');
  if(heroPlant)heroPlant.textContent=total>=80?'🌳':total>=35?'🪴':total>=12?'🌿':'🌱';

  const roots=rootedDailyRoots();
  const done=!!roots[rootedTodayKey()];
  const rootBtn=document.getElementById('completeTodaysRoot');
  if(rootBtn){
    rootBtn.textContent=done?'✓':'○';
    rootBtn.classList.toggle('done',done);
  }

  let title='Take your first step';
  let text='Complete one small habit to help your garden grow.';
  if(waterLit<0.5){title='Drink your first bottle';text='Start gently with 500 mL of water.'}
  else if(walkMinutes<profile.walkGoal){title='Make space for your walk';text=`You have ${Math.max(0,profile.walkGoal-walkMinutes)} minutes left today.`}
  else if(planned<1400){title='Nourish yourself properly';text='Your meal plan is a little light today. Add something filling.'}
  else {title='You are tending your roots';text='Choose one kind thing for your body before the day ends.'}
  set('todaysRootTitle',done?'Today’s root is complete':title);
  set('todaysRootText',done?'A small choice still counts. Your garden is growing.':text);
}

document.addEventListener('DOMContentLoaded',()=>{
  setupRootedOnboarding();
  renderRootedPremium();
  document.getElementById('completeTodaysRoot')?.addEventListener('click',()=>{
    const roots=rootedDailyRoots();
    const key=rootedTodayKey();
    roots[key]=!roots[key];
    localStorage.setItem(ROOTED_ROOTS_KEY,JSON.stringify(roots));
    renderRootedPremium();
  });
  document.addEventListener('click',()=>setTimeout(renderRootedPremium,30));
  document.addEventListener('change',()=>setTimeout(renderRootedPremium,30));
});

// Rooted Build 3: Coach, weekly focus, dynamic day guidance and monthly review
const ROOTED_FOCUS_KEY='rooted-weekly-focus-v3';

function currentWeekKey(){
  const d=new Date();
  const jan1=new Date(d.getFullYear(),0,1);
  const week=Math.ceil((((d-jan1)/86400000)+jan1.getDay()+1)/7);
  return `${d.getFullYear()}-W${week}`;
}
function getWeeklyFocus(){
  try{
    const data=JSON.parse(localStorage.getItem(ROOTED_FOCUS_KEY))||{};
    return data[currentWeekKey()]||'Hydration';
  }catch(e){return 'Hydration'}
}
function saveWeeklyFocus(value){
  let data={};
  try{data=JSON.parse(localStorage.getItem(ROOTED_FOCUS_KEY))||{}}catch(e){}
  data[currentWeekKey()]=value;
  localStorage.setItem(ROOTED_FOCUS_KEY,JSON.stringify(data));
}

function workoutCompletedToday(){
  try{return !!(state.completedWorkouts?.[dk] || state.workoutDone?.[dk])}catch(e){return false}
}
function mealsCompletedToday(){
  try{return selectedMeals().filter(m=>state.mealDone?.[`${dk}-${m.type}`]).length}catch(e){return 0}
}
function coachSnapshot(){
  const profile=rootedProfile()||{walkGoal:30,waterGoal:2.5};
  const water=(typeof waterCount==='function'?waterCount():0)*0.5;
  const walk=getWalkMinutesToday();
  const workout=workoutCompletedToday();
  const meals=mealsCompletedToday();
  let planned=0;
  try{planned=nutritionTotals().planned||0}catch(e){}
  return {profile,water,walk,workout,meals,planned};
}

function renderCoach(){
  const s=coachSnapshot();
  let title='You are doing enough';
  let message='One small supportive choice is a successful day.';
  let action='View today';
  let target='today';

  if(s.water<0.5){
    title='Start with something easy';
    message='Your first 500 mL of water is a gentle way to get moving.';
    action='Log water'; target='meals';
  }else if(s.walk<s.profile.walkGoal){
    const left=Math.max(0,s.profile.walkGoal-s.walk);
    title='A short walk would fit nicely';
    message=`You have ${left} minutes left to reach today’s walking goal.`;
    action='Open Move'; target='workout';
  }else if(!s.workout){
    title='Your body is ready when you are';
    message='Today’s workout is waiting, but a lower-energy option still counts.';
    action='View workout'; target='workout';
  }else if(s.meals<2){
    title='Keep nourishment simple';
    message='Choose the next planned meal or use fresh leftovers.';
    action='Open meals'; target='meals';
  }else if(s.planned<1400){
    title='Your plan looks a little light';
    message='Add a filling snack so you are not finishing the day hungry.';
    action='Add nourishment'; target='meals';
  }else{
    title='You are tending your roots';
    message='You have already supported yourself in several ways today.';
    action='See journey'; target='progress';
  }

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('coachTitle',title);
  set('coachMessage',message);
  const btn=document.getElementById('coachAction');
  if(btn){btn.textContent=action;btn.dataset.target=target}
}

function focusProgress(focus){
  const s=coachSnapshot();
  if(focus==='Hydration') return Math.min(100,(s.water/s.profile.waterGoal)*100);
  if(focus==='Walking') return Math.min(100,(s.walk/s.profile.walkGoal)*100);
  if(focus==='Strength') return s.workout?100:0;
  if(focus==='Home cooking') return Math.min(100,(s.meals/3)*100);
  if(focus==='Recovery'){
    const roots=rootedDailyRoots();
    return roots[rootedTodayKey()]?100:35;
  }
  return 0;
}
function focusMessage(focus,pct){
  if(pct>=100) return `${focus} is complete for today. Beautiful work.`;
  const messages={
    'Hydration':'A bottle at a time is all it takes.',
    'Walking':'Short walks still build strong foundations.',
    'Strength':'One session is enough to keep the habit alive.',
    'Home cooking':'Simple meals count just as much as elaborate ones.',
    'Recovery':'Rest and gentleness are productive too.'
  };
  return messages[focus]||'Build one supportive habit at a time.';
}
function renderWeeklyFocus(){
  const focus=getWeeklyFocus();
  const pct=focusProgress(focus);
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('weeklyFocusTitle',focus);
  set('weeklyFocusMessage',focusMessage(focus,pct));
  const bar=document.getElementById('weeklyFocusBar');
  if(bar)bar.style.width=Math.round(pct)+'%';
}

function monthPrefix(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function countMonthlyBooleanMap(obj){
  const prefix=monthPrefix();
  const days=new Set();
  Object.entries(obj||{}).forEach(([key,value])=>{
    if(value && key.startsWith(prefix)) days.add(key.slice(0,10));
  });
  return days.size;
}
function monthlyReviewData(){
  const prefix=monthPrefix();
  const healthyDays=new Set();
  const waterDays={};
  let walkMinutes=0;
  let workouts=0;

  Object.entries(state.water||{}).forEach(([key,value])=>{
    if(!value || !key.startsWith(prefix))return;
    const day=key.slice(0,10);
    waterDays[day]=(waterDays[day]||0)+1;
    healthyDays.add(day);
  });
  Object.entries(state.mealDone||{}).forEach(([key,value])=>{
    if(value && key.startsWith(prefix))healthyDays.add(key.slice(0,10));
  });
  Object.entries(state.completedWorkouts||{}).forEach(([key,value])=>{
    if(value && key.startsWith(prefix)){workouts++;healthyDays.add(key.slice(0,10))}
  });
  Object.entries(state.workoutDone||{}).forEach(([key,value])=>{
    if(value && key.startsWith(prefix)){workouts++;healthyDays.add(key.slice(0,10))}
  });
  const walkMaps=[state.walking||{},state.walkLogs||{}];
  walkMaps.forEach(map=>Object.entries(map).forEach(([key,value])=>{
    if(key.startsWith(prefix)){
      const mins=Number(value?.minutes||0);
      walkMinutes+=mins;
      if(mins>0)healthyDays.add(key.slice(0,10));
    }
  }));
  const waterGoalDays=Object.values(waterDays).filter(count=>count>=5).length;
  return {healthyDays:healthyDays.size,waterGoalDays,walkMinutes,workouts};
}
function renderMonthlyReview(){
  const data=monthlyReviewData();
  const month=new Intl.DateTimeFormat('en-AU',{month:'long'}).format(new Date());
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('monthReviewTitle',`${month} in Rooted`);
  set('monthHealthyDays',data.healthyDays);
  set('monthWaterDays',data.waterGoalDays);
  set('monthWalkMinutes',data.walkMinutes);
  set('monthWorkouts',data.workouts);
  let badge='Beginning';
  let message='Every small choice you log will begin shaping your month.';
  if(data.healthyDays>=5){badge='Growing';message='You are building a steady pattern, one day at a time.'}
  if(data.healthyDays>=12){badge='Taking root';message='Your habits are becoming part of your normal routine.'}
  if(data.healthyDays>=20){badge='Flourishing';message='You have created a beautifully consistent month.'}
  set('monthReviewBadge',badge);
  set('monthReviewMessage',message);
}

function renderRootedBuild3(){
  renderCoach();
  renderWeeklyFocus();
  renderMonthlyReview();
}

document.addEventListener('DOMContentLoaded',()=>{
  const picker=document.getElementById('focusPicker');
  document.getElementById('changeWeeklyFocus')?.addEventListener('click',()=>{
    if(picker)picker.hidden=!picker.hidden;
  });
  document.querySelectorAll('[data-week-focus]').forEach(btn=>btn.addEventListener('click',()=>{
    saveWeeklyFocus(btn.dataset.weekFocus);
    if(picker)picker.hidden=true;
    renderWeeklyFocus();
  }));
  document.getElementById('coachAction')?.addEventListener('click',e=>{
    const target=e.currentTarget.dataset.target;
    const nav=document.querySelector(`[data-page="${target}"],[data-go="${target}"]`);
    if(nav)nav.click();
  });
  renderRootedBuild3();
  document.addEventListener('click',()=>setTimeout(renderRootedBuild3,40));
  document.addEventListener('change',()=>setTimeout(renderRootedBuild3,40));
});
