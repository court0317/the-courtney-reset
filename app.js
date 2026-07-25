const COURTNEY_RESET_BUILD = "calendar-v3";
const baseDays = [{"day": "Monday", "focus": "Glutes & Legs", "walk": "30 min walking pad", "exercises": [["Goblet squat", "3 \u00d7 10", "Hold one dumbbell at your chest. Sit your hips back and keep knees tracking over toes."], ["Romanian deadlift", "3 \u00d7 10", "Soft knees, push hips back, keep back neutral, squeeze glutes to stand."], ["Glute bridge", "3 \u00d7 15", "Drive through heels and pause at the top."], ["Banded side steps", "3 \u00d7 12 each way", "Keep toes forward and tension on the band."], ["Fire hydrants", "3 \u00d7 12 each side", "Keep hips square and move slowly."]]}, {"day": "Tuesday", "focus": "Upper Body", "walk": "30 min walking pad", "exercises": [["Dumbbell shoulder press", "3 \u00d7 10", "Brace your core and press overhead without arching."], ["Bent-over row", "3 \u00d7 10", "Pull elbows toward your hips and squeeze shoulder blades."], ["Floor chest press", "3 \u00d7 10", "Lower with control and press dumbbells above chest."], ["Bicep curl", "3 \u00d7 12", "Keep elbows tucked and avoid swinging."], ["Overhead tricep extension", "3 \u00d7 12", "Keep elbows pointing forward."], ["Incline plank", "3 \u00d7 20 sec", "Use a bench or sturdy surface if needed."]]}, {"day": "Wednesday", "focus": "Pilates & Core", "walk": "35 min easy walk", "exercises": [["Dead bug", "3 \u00d7 8 each side", "Keep lower back gently pressed down."], ["Bird dog", "3 \u00d7 8 each side", "Reach long without twisting your hips."], ["Glute bridge hold", "3 \u00d7 25 sec", "Keep ribs down and glutes squeezed."], ["Side-lying leg lift", "3 \u00d7 12 each side", "Lead with the heel and keep hips stacked."], ["Modified side plank", "3 \u00d7 15 sec each", "Keep shoulder away from your ear."], ["Full-body stretch", "8 min", "Move gently and breathe slowly."]]}, {"day": "Thursday", "focus": "Glute Builder", "walk": "30 min walking pad", "exercises": [["Hip thrust", "3 \u00d7 12", "Tuck chin slightly and finish by squeezing glutes."], ["Reverse lunge", "3 \u00d7 8 each side", "Step back and keep front foot planted."], ["Sumo squat", "3 \u00d7 12", "Take a wider stance and keep knees tracking over toes."], ["Frog pumps", "3 \u00d7 20", "Soles together, knees open, short controlled reps."], ["Banded kickback", "3 \u00d7 12 each side", "Avoid arching your lower back."], ["Calf raise", "3 \u00d7 15", "Pause briefly at the top."]]}, {"day": "Friday", "focus": "Full Body", "walk": "25 min walking pad", "exercises": [["Dumbbell squat", "3 \u00d7 10", "Keep chest lifted and move with control."], ["Dumbbell deadlift", "3 \u00d7 10", "Hinge from the hips and keep weights close."], ["One-arm row", "3 \u00d7 10 each side", "Brace on a chair and pull toward your hip."], ["Incline push-up", "3 \u00d7 8", "Keep body in one straight line."], ["Standing knee drive", "3 \u00d7 12 each side", "Brace your core and move steadily."], ["Marching finisher", "3 \u00d7 45 sec", "Move briskly without losing control."]]}, {"day": "Saturday", "focus": "Long Walk & Core", "walk": "45\u201360 min comfortable walk", "exercises": [["Heel taps", "3 \u00d7 12 each side", "Keep shoulders relaxed and ribs down."], ["Seated knee tucks", "3 \u00d7 10", "Lean back slightly and move with control."], ["Standing side crunch", "3 \u00d7 12 each side", "Bring rib toward hip."], ["Bridge march", "3 \u00d7 10 each side", "Keep hips level."], ["Stretch", "10 min", "Focus on hips, hamstrings, calves and chest."]]}, {"day": "Sunday", "focus": "Recovery & Reset", "walk": "20\u201330 min easy walk", "exercises": [["Gentle mobility", "10 min", "Move through shoulders, spine, hips and ankles."], ["Meal planning", "10 min", "Choose meals and check what is already at home."], ["Weekly check-in", "5 min", "Record your weight, energy and biggest win."], ["Prepare equipment", "5 min", "Set out your mat, bands and dumbbells for Monday."]]}];
const meals = [{"breakfast": "Chocolate berry overnight oats", "lunch": "Chicken and salad wrap", "snack": "Greek yoghurt with berries", "dinner": "Thai chicken pumpkin soup"}, {"breakfast": "Eggs on toast with fruit", "lunch": "Leftover soup with a bread roll", "snack": "Apple and cheese", "dinner": "Beef mince loaded potatoes"}, {"breakfast": "Banana oat bowl", "lunch": "Chicken rice bowl with corn and carrot", "snack": "Yoghurt pouch or protein milk", "dinner": "Honey soy chicken with rice"}, {"breakfast": "Greek yoghurt, granola and banana", "lunch": "Ham, cheese and salad sandwich", "snack": "Fruit and popcorn", "dinner": "Creamy chicken pasta"}, {"breakfast": "Egg and cheese wrap", "lunch": "Leftover creamy chicken pasta", "snack": "Chocolate milk or yoghurt", "dinner": "Homemade burger bowl with potatoes"}, {"breakfast": "Overnight oats", "lunch": "Pizza scrolls with fruit", "snack": "Crackers and cheese", "dinner": "Chicken and corn soup"}, {"breakfast": "Toast, eggs and fruit", "lunch": "Easy snack plate", "snack": "Favourite treat", "dinner": "Empanadas with a simple side"}];
const grocery = {"Protein": ["Chicken breast", "Lean beef mince", "Eggs", "Greek yoghurt", "Cheese", "Ham"], "Fruit & veg": ["Pumpkin", "Potatoes", "Carrots", "Corn", "Broccoli", "Baby spinach", "Bananas", "Apples", "Frozen berries"], "Pantry": ["Oats", "Rice", "Wholemeal wraps", "Bread", "Pasta", "Chicken stock", "Light coconut milk", "Thai red curry paste", "Honey", "Soy sauce", "Pizza sauce"], "Optional": ["Fabric booty bands", "Long resistance band", "Core sliders", "Foam roller", "1\u20132 kg ankle weights"]};
const quotes = [
  "You do not need a perfect day. You only need the next helpful choice.",
  "Today’s job is simply to show up and do what you can.",
  "Strong habits are built on ordinary days like this one.",
  "A shorter workout still counts. Consistency is the win.",
  "You are allowed to go slowly. You are not starting over.",
  "Future Courtney will be glad you kept this promise to yourself.",
  "Recovery is part of the program, not time away from it."
];


// Official program calendar.
// Month numbers in JavaScript start at 0, so 6 means July.
const PROGRAM_START = new Date(2026, 6, 27);
const PROGRAM_DAYS = 56;

function localDayNumber(date) {
  // Noon avoids daylight-saving and midnight timezone edge cases.
  return Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12).getTime() /
    86400000
  );
}

function calendarStatus(now = new Date()) {
  const elapsed = localDayNumber(now) - localDayNumber(PROGRAM_START);

  if (elapsed < 0) {
    return {
      stage: "countdown",
      daysUntil: Math.abs(elapsed),
      week: 1,
      day: 0,
      programDay: 0
    };
  }

  if (elapsed >= PROGRAM_DAYS) {
    return {
      stage: "complete",
      daysUntil: 0,
      week: 8,
      day: 6,
      programDay: 56
    };
  }

  return {
    stage: "active",
    daysUntil: 0,
    week: Math.floor(elapsed / 7) + 1,
    day: elapsed % 7,
    programDay: elapsed + 1
  };
}

function syncToCalendar() {
  const status = calendarStatus();
  state.week = status.week;
  state.day = status.day;
  return status;
}

const key = "courtneyResetV1";
let state = JSON.parse(localStorage.getItem(key) || "null") || {
  week:1, day:(new Date().getDay()+6)%7,
  checks:{}, water:{}, meals:{}, notes:{}, groceries:{}, checkins:{}
};

function save(){ localStorage.setItem(key, JSON.stringify(state)); renderAll(); }
function id(w,d,type,i=0){ return `w${w}d${d}-${type}-${i}`; }
function phaseInfo(w){
  if(w<=2) return {sets:"Foundation phase", tip:"Focus on technique. Rest 60–75 seconds."};
  if(w<=4) return {sets:"Build phase", tip:"Add one or two reps or use a slightly heavier weight."};
  if(w<=6) return {sets:"Strength phase", tip:"Add a fourth set to the first two exercises where comfortable."};
  return {sets:"Confidence phase", tip:"Use your strongest safe weight and finish each session feeling challenged, not wrecked."};
}

function renderSelectors(){
  weekSelect.innerHTML = Array.from({length:8},(_,i)=>`<option value="${i+1}">Week ${i+1}</option>`).join("");
  daySelect.innerHTML = baseDays.map((x,i)=>`<option value="${i}">${x.day}</option>`).join("");
  weekSelect.value=state.week; daySelect.value=state.day;
  weekPill.textContent=`Week ${state.week}`;
}

function renderDailyPlan(){
  const d=baseDays[state.day], p=phaseInfo(state.week);
  const ex = d.exercises.map((e,i)=>{
    let reps=e[1];
    if(state.week>=3 && state.week<=4) reps=reps.replace("3 ×","3 ×");
    if(state.week>=5 && i<2) reps=reps.replace("3 ×","4 ×");
    return `<label class="task">
      <input type="checkbox" data-check="${id(state.week,state.day,'ex',i)}" ${state.checks[id(state.week,state.day,'ex',i)]?'checked':''}>
      <span><b>${e[0]} — ${reps}</b><small>${e[2]}</small></span>
    </label>`;
  }).join("");
  dailyPlan.innerHTML=`
    <div class="card hero"><h2>${d.day} — ${d.focus}</h2><p>${p.sets} · ${p.tip}</p></div>
    <div class="card"><h3>Walking</h3>
      <label class="task"><input type="checkbox" data-check="${id(state.week,state.day,'walk')}" ${state.checks[id(state.week,state.day,'walk')]?'checked':''}>
      <span><b>${d.walk}</b><small>Choose a pace that lets you speak in short sentences.</small></span></label>
    </div>
    <div class="card"><h3>Workout</h3>${ex}</div>
    <div class="card"><h3>Daily basics</h3>
      ${["2 L water","Protein with meals","5–10 min stretch","Prepare tomorrow"].map((t,i)=>`<label class="task"><input type="checkbox" data-check="${id(state.week,state.day,'basic',i)}" ${state.checks[id(state.week,state.day,'basic',i)]?'checked':''}><span><b>${t}</b></span></label>`).join("")}
    </div>`;
  bindChecks();
}

function renderMeals(){
  const m=meals[state.day];
  mealCards.innerHTML=["breakfast","lunch","snack","dinner"].map((k,i)=>`
    <label class="task"><input type="checkbox" data-meal="${id(state.week,state.day,'meal',i)}" ${state.meals[id(state.week,state.day,'meal',i)]?'checked':''}>
    <span><b>${k[0].toUpperCase()+k.slice(1)}</b><small>${m[k]}</small></span></label>`).join("");
  waterChecks.innerHTML=Array.from({length:5},(_,i)=>`
    <label class="task"><input type="checkbox" data-water="${id(state.week,state.day,'water',i)}" ${state.water[id(state.week,state.day,'water',i)]?'checked':''}>
    <span><b>${(i+1)*500} mL</b><small>${i===4?"Optional 2.5 L bonus goal":"Running total"}</small></span></label>`).join("");
  dailyNotes.value=state.notes[`w${state.week}d${state.day}`]||"";
  document.querySelectorAll("[data-meal]").forEach(el=>el.addEventListener("change",()=>{state.meals[el.dataset.meal]=el.checked;save();}));
  document.querySelectorAll("[data-water]").forEach(el=>el.addEventListener("change",()=>{state.water[el.dataset.water]=el.checked;save();}));
}

function renderGroceries(){
  groceryList.innerHTML=Object.entries(grocery).map(([cat,items])=>`
    <h3 style="margin-top:16px">${cat}</h3>
    ${items.map((x,i)=>{const gid=`${cat}-${i}`;return `<label class="task"><input type="checkbox" data-grocery="${gid}" ${state.groceries[gid]?'checked':''}><span><b>${x}</b></span></label>`}).join("")}
  `).join("");
  document.querySelectorAll("[data-grocery]").forEach(el=>el.addEventListener("change",()=>{state.groceries[el.dataset.grocery]=el.checked;save();}));
}

function todayCompletion(w=state.week,d=state.day){
  const day=baseDays[d];
  const keys=[id(w,d,'walk'),...day.exercises.map((_,i)=>id(w,d,'ex',i)),...Array.from({length:4},(_,i)=>id(w,d,'basic',i))];
  const done=keys.filter(k=>state.checks[k]).length;
  return {done,total:keys.length,pct:Math.round(done/keys.length*100)};
}

function renderHome(){
  const calendar = calendarStatus();
  const d=baseDays[state.day], c=todayCompletion();

  if (calendar.stage === "countdown") {
    const word = calendar.daysUntil === 1 ? "day" : "days";
    greeting.textContent = "Your reset starts Monday 🌿";
    todayFocus.textContent =
      `${calendar.daysUntil} ${word} to go · Week 1 Monday is ready`;
    dailyBar.style.width = "0%";
    dailyPercent.textContent = "Countdown";
  } else if (calendar.stage === "complete") {
    greeting.textContent = "You completed the 8 weeks 🎉";
    todayFocus.textContent = "Your full Courtney Reset calendar is complete.";
    dailyBar.style.width = "100%";
    dailyPercent.textContent = "Finished";
  } else {
    greeting.textContent = "Hi Courtney 🌿";
    todayFocus.textContent =
      `Day ${calendar.programDay} of 56 · Week ${calendar.week} · ${d.day} · ${d.focus}`;
    dailyBar.style.width=c.pct+"%";
    dailyPercent.textContent=c.pct+"%";
  }

  const all=[];
  for(let w=1;w<=8;w++)for(let dd=0;dd<7;dd++)all.push(todayCompletion(w,dd));
  const done=all.reduce((a,x)=>a+x.done,0), total=all.reduce((a,x)=>a+x.total,0);
  programPercent.textContent=Math.round(done/total*100)+"%";
  const waterDone=Array.from({length:5},(_,i)=>state.water[id(state.week,state.day,'water',i)]).filter(Boolean).length;
  waterMetric.textContent=`${waterDone} / 5`;
  const weekDone=Array.from({length:7},(_,dd)=>todayCompletion(state.week,dd).pct===100).filter(Boolean).length;
  weeklyMetric.textContent=`${weekDone} / 7`;

  let streakCount=0;
  for(let w=1;w<=8;w++)for(let dd=0;dd<7;dd++){
    if(todayCompletion(w,dd).pct>=70)streakCount++;
    else if(w<state.week || (w===state.week&&dd<state.day))streakCount=0;
  }
  streak.textContent=`${streakCount} day${streakCount===1?"":"s"}`;

  if (calendar.stage === "countdown") {
    coachNote.textContent =
      "Your first session is Week 1 Monday: Glutes & Legs. Set out your mat, dumbbells and booty band so you are ready.";
  } else if (calendar.stage === "complete") {
    coachNote.textContent =
      "Eight weeks done. Take your final measurements, celebrate your progress and choose what you want to build next.";
  } else {
    coachNote.textContent=quotes[state.day];
  }

  quickTasks.innerHTML=[
    [id(state.week,state.day,'walk'),d.walk],
    [id(state.week,state.day,'basic',0),"Drink at least 2 L water"],
    [id(state.week,state.day,'basic',1),"Include protein with meals"],
    [id(state.week,state.day,'basic',2),"Complete your stretch"]
  ].map(([k,t])=>`<label class="task"><input type="checkbox" data-check="${k}" ${state.checks[k]?'checked':''}><span><b>${t}</b></span></label>`).join("");
  bindChecks();
}

function bindChecks(){
  document.querySelectorAll("[data-check]").forEach(el=>el.addEventListener("change",()=>{state.checks[el.dataset.check]=el.checked;save();}));
}

function renderCheckins(){
  const entries=Object.entries(state.checkins);
  if(!entries.length){checkinHistory.textContent="No check-ins yet.";return;}
  checkinHistory.innerHTML=entries.sort((a,b)=>Number(a[0])-Number(b[0])).map(([w,x])=>`
    <div class="recipe"><b>Week ${w}</b><br>
    Weight: ${x.weight||"—"} kg · Waist: ${x.waist||"—"} cm · Hips: ${x.hips||"—"} cm<br>
    Energy: ${x.energy||"—"}/10 · Sleep: ${x.sleep||"—"} hrs<br>
    <span>${x.win||""}</span></div>`).join("");
}

function renderAll(){
  renderSelectors(); renderHome(); renderDailyPlan(); renderMeals(); renderGroceries(); renderCheckins();
}

weekSelect.addEventListener("change",()=>{state.week=Number(weekSelect.value);save();});
daySelect.addEventListener("change",()=>{state.day=Number(daySelect.value);save();});
dailyNotes.addEventListener("input",()=>{state.notes[`w${state.week}d${state.day}`]=dailyNotes.value;localStorage.setItem(key,JSON.stringify(state));});
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab,.section").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); document.getElementById(btn.dataset.target).classList.add("active");
}));

saveCheckin.addEventListener("click",()=>{
  state.checkins[state.week]={
    weight:weightInput.value, waist:waistInput.value, hips:hipsInput.value,
    energy:energyInput.value, sleep:sleepInput.value, win:winInput.value
  };
  save(); alert("Week "+state.week+" check-in saved.");
});

exportBtn.addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="courtney-reset-backup.json";a.click();URL.revokeObjectURL(a.href);
});
importFile.addEventListener("change",async()=>{
  const file=importFile.files[0]; if(!file)return;
  try{state=JSON.parse(await file.text());save();alert("Backup imported.");}catch(e){alert("That backup file could not be read.");}
});
resetBtn.addEventListener("click",()=>{
  if(confirm("Reset all workouts, meals, groceries and check-ins?")){localStorage.removeItem(key);location.reload();}
});

syncToCalendar();
localStorage.setItem(key, JSON.stringify(state));
renderAll();

// Make the site available offline when hosted over HTTPS (including GitHub Pages).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works normally if service-worker registration is unavailable.
    });
  });
}

