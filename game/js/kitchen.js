// kitchen.js - 自由キッチンモードのロジック

import { RECIPES, TOPPINGS, SAUCES, CHEESE_TYPES, MEAT_TYPES, EYE_COMMENTS } from './data.js';
import { el, clearContainer, createButton, createDishDisplay, showSparkles } from './ui.js';
import { playFanfare, playClick, playSuccess } from './audio.js';
import { createTapAction, createHoldAction, createEyeAction, createToppingAction, createChoiceAction } from './cooking.js';

export function startKitchenMenu(container, state, switchScene) {
  clearContainer(container);
  const screen = el('div', { class: 'screen kitchen-menu' });
  const title = el('h2', { class: 'screen-title', text: '🏠 じゆうキッチン' });
  const subtitle = el('p', { class: 'screen-subtitle', text: 'つくりたい りょうりを えらぼう！' });
  screen.appendChild(title);
  screen.appendChild(subtitle);

  const grid = el('div', { class: 'recipe-grid' });
  Object.values(RECIPES).forEach(recipe => {
    const card = el('div', {
      class: 'recipe-card',
      onclick: () => {
        playClick();
        startCooking(container, state, switchScene, recipe);
      },
    });
    card.appendChild(el('div', { class: 'recipe-emoji', text: recipe.emoji }));
    card.appendChild(el('div', { class: 'recipe-name', text: recipe.name }));
    grid.appendChild(card);
  });
  screen.appendChild(grid);

  const btnRow = el('div', { class: 'btn-row' });
  btnRow.appendChild(createButton('📖 アルバム', () => {
    playClick();
    switchScene('album');
  }));
  btnRow.appendChild(createButton('🔙 もどる', () => {
    playClick();
    switchScene('modeSelect');
  }));
  screen.appendChild(btnRow);
  container.appendChild(screen);
}

function startCooking(container, state, switchScene, recipe) {
  clearContainer(container);
  state.currentRecipe = recipe;
  state.cookingStep = 0;
  state.eyeCount = 0;
  state.toppings = [];
  state.selectedMeat = null;
  state.selectedSauce = null;
  state.selectedCheeses = [];

  renderCookingStep(container, state, switchScene);
}

function renderCookingStep(container, state, switchScene) {
  clearContainer(container);
  const recipe = state.currentRecipe;
  const stepIdx = state.cookingStep;
  const step = recipe.steps[stepIdx];
  const stepName = recipe.stepNames[stepIdx];
  const action = recipe.stepActions[stepIdx];

  const screen = el('div', { class: 'screen cooking-screen' });

  // ステップインジケーター
  const steps = el('div', { class: 'step-indicator' });
  recipe.stepNames.forEach((name, i) => {
    const s = el('span', {
      class: `step-dot ${i < stepIdx ? 'done' : ''} ${i === stepIdx ? 'current' : ''}`,
      text: i < stepIdx ? '✓' : (i + 1),
    });
    steps.appendChild(s);
  });
  screen.appendChild(steps);

  const stepTitle = el('h3', { class: 'step-title', text: `${recipe.emoji} ${stepName}` });
  screen.appendChild(stepTitle);
  const actionHint = el('p', { class: 'action-hint', text: action });
  screen.appendChild(actionHint);

  const area = el('div', { class: 'cooking-area' });

  function nextStep() {
    state.cookingStep++;
    if (state.cookingStep >= recipe.steps.length) {
      showResult(container, state, switchScene);
    } else {
      renderCookingStep(container, state, switchScene);
    }
  }

  switch (step) {
    case 'knead':
      createTapAction(area, { target: 15, emoji: '🥩', soundFn: () => import('./audio.js').then(m => m.playSquish()), onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'shape':
      createTapAction(area, { target: 10, emoji: '🫓', soundFn: () => import('./audio.js').then(m => m.playSquish()), onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'grill':
      createHoldAction(area, { target: 15, emoji: '🍳', type: 'grill', onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'eyes':
      createEyeAction(area, {
        onAdd: (count) => { state.eyeCount = count; },
        onComplete: (count) => { state.eyeCount = count; playSuccess(); nextStep(); },
      });
      break;
    case 'plate':
      createToppingAction(area, {
        toppings: TOPPINGS,
        onComplete: (selected) => { state.toppings = selected; playSuccess(); nextStep(); },
      });
      break;
    case 'cut':
      createTapAction(area, { target: 12, emoji: '🥔', soundFn: () => import('./audio.js').then(m => m.playChop()), onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'fry':
      createHoldAction(area, { target: 18, emoji: '🍟', type: 'fry', onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'salt':
      createTapAction(area, { target: 8, emoji: '🧂', soundFn: () => import('./audio.js').then(m => m.playSprinkle()), onComplete: () => { playSuccess(); nextStep(); } });
      break;
    case 'chooseMeat':
      createChoiceAction(area, {
        title: 'おにくを えらぼう！',
        choices: MEAT_TYPES,
        multiSelect: false,
        onComplete: (meat) => { state.selectedMeat = meat; nextStep(); },
      });
      break;
    case 'grillSteak':
      createHoldAction(area, {
        target: 20,
        emoji: state.selectedMeat?.emoji || '🥩',
        type: 'grill',
        onComplete: () => { playSuccess(); nextStep(); },
      });
      break;
    case 'sauce':
      createChoiceAction(area, {
        title: 'ソースを えらぼう！',
        choices: SAUCES,
        multiSelect: false,
        onComplete: (sauce) => { state.selectedSauce = sauce; nextStep(); },
      });
      break;
    case 'chooseCheese':
      createChoiceAction(area, {
        title: 'チーズを えらぼう！（いくつでも）',
        choices: CHEESE_TYPES,
        multiSelect: true,
        onComplete: (cheeses) => { state.selectedCheeses = cheeses; nextStep(); },
      });
      break;
    case 'plateCheese':
      createTapAction(area, { target: 8, emoji: '🧀', soundFn: () => import('./audio.js').then(m => m.playPop()), onComplete: () => { playSuccess(); nextStep(); } });
      break;
  }

  screen.appendChild(area);
  container.appendChild(screen);
}

function showResult(container, state, switchScene) {
  clearContainer(container);
  playFanfare();

  const recipe = state.currentRecipe;
  const screen = el('div', { class: 'screen result-screen' });

  const completeText = el('h2', { class: 'complete-text pop-in', text: 'かんせい！' });
  screen.appendChild(completeText);

  const extras = {
    eyeCount: state.eyeCount,
    toppings: state.toppings,
    sauce: state.selectedSauce,
    meat: state.selectedMeat,
    cheeses: state.selectedCheeses,
  };

  const dishDisplay = createDishDisplay(recipe, extras);
  dishDisplay.classList.add('pop-in');
  screen.appendChild(dishDisplay);

  setTimeout(() => showSparkles(screen), 300);

  const subtitle = el('h3', { class: 'result-subtitle', text: '🍽️ どうぞ めしあがれ！' });
  screen.appendChild(subtitle);

  if (recipe.hasEyes && state.eyeCount > 0) {
    const eyeComment = getEyeComment(state.eyeCount);
    const eyeText = el('p', { class: 'eye-comment', text: `👁️ × ${state.eyeCount}こ ─ ${eyeComment}` });
    screen.appendChild(eyeText);
    if (state.eyeCount > state.maxEyes) state.maxEyes = state.eyeCount;
  }

  if (recipe.id === 'hamburger' && state.eyeCount >= 10) {
    const special = el('div', { class: 'special-badge pop-in', text: '🏆 せかいいち おいしい！' });
    screen.appendChild(special);
  }

  // アルバムに保存
  state.album.push({
    recipe: recipe.id,
    name: recipe.name,
    emoji: recipe.emoji,
    eyeCount: state.eyeCount,
    toppings: [...state.toppings],
    sauce: state.selectedSauce,
    timestamp: Date.now(),
  });
  state.recipesCompleted.add(recipe.id);

  const btnRow = el('div', { class: 'btn-row' });
  btnRow.appendChild(createButton('🔄 もういちど', () => {
    playClick();
    startCooking(container, state, switchScene, recipe);
  }, 'btn-primary'));
  btnRow.appendChild(createButton('📋 メニューへ', () => {
    playClick();
    startKitchenMenu(container, state, switchScene);
  }));
  btnRow.appendChild(createButton('🏠 タイトルへ', () => {
    playClick();
    switchScene('title');
  }));
  screen.appendChild(btnRow);
  container.appendChild(screen);
}

function getEyeComment(count) {
  const comment = EYE_COMMENTS.find(c => count >= c.min && count <= c.max);
  return comment ? comment.text : 'すごい！';
}
