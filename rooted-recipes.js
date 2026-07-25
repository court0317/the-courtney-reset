(() => {
  'use strict';
  const STORAGE_KEY = 'rooted-my-recipes-v1';
  const TAG_OPTIONS = ['Breakfast','Lunch','Dinner','Snack','Dessert'];
  const $ = id => document.getElementById(id);
  const section = $('myRecipesSection');
  if (!section) return;

  let recipes = loadRecipes();
  let favouritesOnly = false;
  let pendingPhoto = '';
  let selectedTags = [];

  function loadRecipes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (_) { return []; }
  }
  function saveRecipes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    if (window.RootedCloud?.user) window.RootedCloud.syncNow?.();
    renderRecipes();
  }
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const num = id => Math.max(0, Number($(id).value || 0));

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

  function renderRecipes() {
    const query = $('recipeSearch').value.trim().toLowerCase();
    let list = recipes.filter(r => !favouritesOnly || r.favourite);
    if (query) list = list.filter(r => [r.name,r.type,...(r.tags||[]),...(r.ingredients||[])].join(' ').toLowerCase().includes(query));
    $('recipeFavouritesBtn').textContent = favouritesOnly ? '♥ Showing favourites' : '♡ Favourites';
    $('recipeFavouritesBtn').classList.toggle('active', favouritesOnly);
    $('myRecipesGrid').innerHTML = list.length ? list.map(r => {
      const nutrition = [r.calories ? `${r.calories} cal` : null, r.protein ? `${r.protein}g protein` : null, r.carbs ? `${r.carbs}g carbs` : null, r.fat ? `${r.fat}g fat` : null].filter(Boolean);
      return `
      <article class="saved-recipe" data-view-recipe="${esc(r.id)}">
        <div class="saved-recipe-photo">${r.photo ? `<img src="${r.photo}" alt="${esc(r.name)}">` : '<span>🍽️</span>'}</div>
        <div class="saved-recipe-body">
          <div class="saved-recipe-top"><span class="eyebrow">${esc(r.type)}</span><button class="recipe-heart" data-favourite-recipe="${esc(r.id)}" aria-label="Favourite">${r.favourite?'♥':'♡'}</button></div>
          <h4>${esc(r.name)}</h4>
          <p>${nutrition.length ? nutrition.join(' · ') : 'Nutrition optional'}</p>
          <div class="saved-recipe-actions"><button class="outline" data-view-recipe="${esc(r.id)}">View</button><button class="text-btn" data-add-recipe="${esc(r.id)}">Add to today</button></div>
        </div>
      </article>`;
    }).join('') : `<div class="empty recipe-empty"><b>${recipes.length ? 'No recipes match that search.' : 'Your recipe book is ready.'}</b><p>${recipes.length ? 'Try another word or show all recipes.' : 'Tap “Add recipe” to save your first one.'}</p></div>`;
  }

  function resetForm(recipe = null) {
    $('recipeEditorForm').reset();
    $('recipeEditId').value = recipe?.id || '';
    $('recipeEditorTitle').textContent = recipe ? 'Edit recipe' : 'Add recipe';
    $('recipeName').value = recipe?.name || '';
    $('recipeType').value = recipe?.type || 'Dinner';
    $('recipeServes').value = recipe?.serves || 4;
    $('recipeCalories').value = recipe?.calories || '';
    $('recipeProtein').value = recipe?.protein || '';
    $('recipeCarbs').value = recipe?.carbs || '';
    $('recipeFat').value = recipe?.fat || '';
    $('recipeFiber').value = recipe?.fibre || '';
    $('recipePrep').value = recipe?.prep || '';
    $('recipeCook').value = recipe?.cook || '';
    $('recipeIngredients').value = (recipe?.ingredients || []).join('\n');
    $('recipeMethod').value = recipe?.method || '';
    $('recipeFavourite').checked = !!recipe?.favourite;
    selectedTags = Array.isArray(recipe?.tags) ? recipe.tags : [];
    pendingPhoto = recipe?.photo || '';
    $('recipePhotoPreview').src = pendingPhoto;
    $('recipePhotoPreview').hidden = !pendingPhoto;
    $('recipePhotoHint').textContent = pendingPhoto ? 'Current photo saved — choose another to replace it' : 'Choose a photo from your phone or computer';
    refreshTagButtons();
  }

  function openEditor(recipe = null) {
    resetForm(recipe);
    $('recipeEditorModal').showModal();
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
          ${(r.tags||[]).length ? `<div class="recipe-tags">${r.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div>` : ''}
          <div class="recipe-section">
            <h3>Ingredients</h3>
            <ul class="recipe-ingredient-list">${r.ingredients.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div class="recipe-section">
            <h3>Method</h3>
            <div class="recipe-method-full">${esc(r.method).replace(/\n/g,'<br>')}</div>
          </div>
          <div class="recipe-view-actions"><button class="primary" data-add-recipe="${esc(r.id)}">Add to Today’s Meals</button><button class="outline" data-edit-recipe="${esc(r.id)}">Edit</button><button class="text-btn danger" data-delete-recipe="${esc(r.id)}">Delete</button></div>
        </div>
      </div>`;
    $('recipeViewModal').showModal();
  }

  function addToToday(id) {
    const r = recipes.find(x => x.id === id); if (!r) return;
    const meal = {id:`custom-${r.id}`,type:r.type,name:r.name,icon:'🍽️',cal:r.calories||0,protein:r.protein||0,carbs:r.carbs||0,fat:r.fat||0,fibre:r.fibre||0,ingredients:r.ingredients,method:r.method,customRecipe:true};
    if (typeof setMeal === 'function') {
      const allowed = ['Breakfast','Lunch','Dinner','Snack'];
      setMeal(allowed.includes(r.type) ? r.type : 'Snack', meal);
      $('recipeViewModal')?.close();
      alert(`${r.name} was added to today.`);
    } else alert('Recipe saved. Refresh Rooted, then try adding it to today again.');
  }

  $('addRecipeBtn').addEventListener('click', () => openEditor());
  $('recipeSearch').addEventListener('input', renderRecipes);
  $('recipeFavouritesBtn').addEventListener('click', () => { favouritesOnly = !favouritesOnly; renderRecipes(); });
  $('recipePhoto').addEventListener('change', event => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) { alert('Please choose a photo smaller than 2.5 MB.'); event.target.value=''; return; }
    const reader = new FileReader(); reader.onload = () => { pendingPhoto = reader.result; $('recipePhotoPreview').src = pendingPhoto; $('recipePhotoPreview').hidden=false; }; reader.readAsDataURL(file);
  });
  $('recipeEditorForm').addEventListener('submit', event => {
    event.preventDefault();
    const id = $('recipeEditId').value || (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`);
    const existing = recipes.find(x => x.id === id);
    const recipe = {id,name:$('recipeName').value.trim(),type:$('recipeType').value,serves:num('recipeServes')||1,photo:pendingPhoto,calories:num('recipeCalories'),protein:num('recipeProtein'),carbs:num('recipeCarbs'),fat:num('recipeFat'),fibre:num('recipeFiber'),prep:num('recipePrep'),cook:num('recipeCook'),ingredients:$('recipeIngredients').value.split('\n').map(x=>x.trim()).filter(Boolean),method:$('recipeMethod').value.trim(),tags:selectedTags.filter(Boolean),favourite:$('recipeFavourite').checked,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
    recipes = existing ? recipes.map(x => x.id === id ? recipe : x) : [recipe, ...recipes];
    saveRecipes(); $('recipeEditorModal').close();
  });

  document.addEventListener('click', event => {
    const favourite = event.target.closest('[data-favourite-recipe]');
    if (favourite) { event.preventDefault(); event.stopPropagation(); const r=recipes.find(x=>x.id===favourite.dataset.favouriteRecipe); if(r){r.favourite=!r.favourite;saveRecipes();} return; }
    const add = event.target.closest('[data-add-recipe]'); if (add) { event.preventDefault(); event.stopPropagation(); addToToday(add.dataset.addRecipe); return; }
    const edit = event.target.closest('[data-edit-recipe]'); if(edit){ const r=recipes.find(x=>x.id===edit.dataset.editRecipe); $('recipeViewModal').close(); openEditor(r); return; }
    const del = event.target.closest('[data-delete-recipe]'); if(del){ const r=recipes.find(x=>x.id===del.dataset.deleteRecipe); if(r&&confirm(`Delete ${r.name}?`)){recipes=recipes.filter(x=>x.id!==r.id);saveRecipes();$('recipeViewModal').close();} return; }
    const view = event.target.closest('[data-view-recipe]'); if(view) viewRecipe(view.dataset.viewRecipe);
  });
  document.querySelectorAll('[data-recipe-tag]').forEach(btn => {
    btn.addEventListener('click', () => toggleTag(btn.dataset.recipeTag));
  });
  document.querySelectorAll('.recipe-modal .modal-close').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
  renderRecipes();
})();
