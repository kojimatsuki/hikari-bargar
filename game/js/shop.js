// shop.js - バーガーショップモードのロジック

import { ORDERS, BURGER_INGREDIENTS, REACTIONS, CUSTOMER_FACES } from './data.js';
import { el, clearContainer, createButton, createBurgerStack, createStars, createTimerBar, updateTimerBar, showSparkles } from './ui.js';
import { playChime, playPop, playFanfare, playSuccess, playMiss, playClick, playTick } from './audio.js';

export function startShop(container, state, switchScene) {
  state.shopOrderIndex = 0;
  state.customersServedThisSession = 0;
  state.totalStarsThisSession = 0;
  state.currentPerfectStreak = 0;
  showNextCustomer(container, state, switchScene);
}

function getOrderForIndex(index) {
  if (index < ORDERS.length) return ORDERS[index];
  // ランダムに上位レベルを出す
  const highLevel = ORDERS.filter(o => o.level >= 3);
  return highLevel[Math.floor(Math.random() * highLevel.length)];
}

function showNextCustomer(container, state, switchScene) {
  clearContainer(container);

  if (state.shopOrderIndex > 0 && state.shopOrderIndex % 5 === 0) {
    showShopProgress(container, state, switchScene);
    return;
  }

  const order = getOrderForIndex(state.shopOrderIndex);
  const face = CUSTOMER_FACES[Math.floor(Math.random() * CUSTOMER_FACES.length)];

  playChime();

  const screen = el('div', { class: 'screen shop-screen' });

  // お客さん
  const customer = el('div', { class: 'customer-area' });
  const customerFace = el('div', { class: 'customer-face pop-in', text: face });
  const dialogue = el('div', { class: 'customer-dialogue' });
  const dialogueText = el('p', { class: 'dialogue-text', text: order.dialogue });
  dialogue.appendChild(dialogueText);
  customer.appendChild(customerFace);
  customer.appendChild(dialogue);
  screen.appendChild(customer);

  // 注文内容
  const orderInfo = el('div', { class: 'order-info' });
  const levelBadge = el('span', { class: 'level-badge', text: `Lv.${order.level}` });
  const orderName = el('span', { class: 'order-name', text: order.name });
  orderInfo.appendChild(levelBadge);
  orderInfo.appendChild(orderName);
  screen.appendChild(orderInfo);

  // 注文レシピ表示
  const recipe = el('div', { class: 'order-recipe' });
  const recipeLabel = el('div', { class: 'recipe-label', text: '⬇ じゅんばん ⬇' });
  recipe.appendChild(recipeLabel);
  const recipeList = el('div', { class: 'recipe-list' });
  order.ingredients.forEach(id => {
    const item = BURGER_INGREDIENTS.find(b => b.id === id);
    if (item) recipeList.appendChild(el('span', { class: 'recipe-item', text: item.emoji }));
  });
  recipe.appendChild(recipeList);
  screen.appendChild(recipe);

  const startBtn = createButton('つくりはじめる！', () => {
    playClick();
    startOrder(container, state, switchScene, order, face);
  }, 'btn-primary btn-large');
  screen.appendChild(startBtn);

  container.appendChild(screen);
}

function startOrder(container, state, switchScene, order, customerFace) {
  clearContainer(container);
  const stacked = [];
  let timeLeft = order.timeLimit;
  let timerDone = false;

  const screen = el('div', { class: 'screen shop-cooking-screen' });

  // タイマー
  const { bar: timerBar, fill: timerFill } = createTimerBar();
  const timeText = el('div', { class: 'time-text', text: `⏱ ${timeLeft}びょう` });
  screen.appendChild(timerBar);
  screen.appendChild(timeText);

  // 注文ミニ表示
  const miniOrder = el('div', { class: 'mini-order' });
  order.ingredients.forEach(id => {
    const item = BURGER_INGREDIENTS.find(b => b.id === id);
    if (item) miniOrder.appendChild(el('span', { class: 'mini-item', text: item.emoji }));
  });
  screen.appendChild(miniOrder);

  // バーガースタック表示
  const stackArea = el('div', { class: 'stack-area' });
  const stackDisplay = el('div', { class: 'stack-display' });
  stackArea.appendChild(stackDisplay);
  screen.appendChild(stackArea);

  // 材料ボタン
  const ingredientTray = el('div', { class: 'ingredient-tray' });
  BURGER_INGREDIENTS.forEach(item => {
    const btn = el('button', {
      class: 'ingredient-btn',
      html: `${item.emoji}<br><span class="ing-name">${item.name}</span>`,
      onclick: () => {
        if (timerDone) return;
        stacked.push(item.id);
        playPop();
        btn.classList.add('ing-bounce');
        setTimeout(() => btn.classList.remove('ing-bounce'), 200);
        updateStack();
      },
    });
    ingredientTray.appendChild(btn);
  });
  screen.appendChild(ingredientTray);

  // とりけしボタン & かんせいボタン
  const actionRow = el('div', { class: 'btn-row' });
  actionRow.appendChild(createButton('↩ とりけし', () => {
    if (stacked.length > 0 && !timerDone) {
      stacked.pop();
      playClick();
      updateStack();
    }
  }));
  actionRow.appendChild(createButton('🍔 かんせい！', () => {
    if (timerDone) return;
    timerDone = true;
    clearInterval(timerInterval);
    evaluateOrder(container, state, switchScene, order, stacked, customerFace, timeLeft);
  }, 'btn-primary'));
  screen.appendChild(actionRow);

  container.appendChild(screen);

  function updateStack() {
    stackDisplay.innerHTML = '';
    const stackEl = createBurgerStack(stacked, BURGER_INGREDIENTS);
    stackDisplay.appendChild(stackEl);
  }

  // タイマー開始
  const timerInterval = setInterval(() => {
    timeLeft--;
    timeText.textContent = `⏱ ${timeLeft}びょう`;
    updateTimerBar(timerFill, (timeLeft / order.timeLimit) * 100);
    if (timeLeft <= 5 && timeLeft > 0) playTick();
    if (timeLeft <= 0) {
      timerDone = true;
      clearInterval(timerInterval);
      evaluateOrder(container, state, switchScene, order, stacked, customerFace, 0);
    }
  }, 1000);
}

function evaluateOrder(container, state, switchScene, order, stacked, customerFace, timeLeft) {
  clearContainer(container);

  // 正解との比較
  const correct = order.ingredients;
  let matchCount = 0;
  const len = Math.max(correct.length, stacked.length);
  for (let i = 0; i < Math.min(correct.length, stacked.length); i++) {
    if (correct[i] === stacked[i]) matchCount++;
  }
  const accuracy = len > 0 ? matchCount / len : 0;
  const timeBonus = timeLeft > 0 ? 0.1 : 0;
  const score = accuracy + timeBonus;

  let reaction;
  if (score >= 1.0) reaction = REACTIONS.perfect;
  else if (score >= 0.7) reaction = REACTIONS.good;
  else if (score >= 0.4) reaction = REACTIONS.ok;
  else reaction = REACTIONS.miss;

  if (reaction === REACTIONS.perfect) {
    playFanfare();
    state.currentPerfectStreak++;
    if (state.currentPerfectStreak > state.perfectStreak) {
      state.perfectStreak = state.currentPerfectStreak;
    }
  } else if (reaction === REACTIONS.good) {
    playSuccess();
    state.currentPerfectStreak = 0;
  } else {
    playMiss();
    state.currentPerfectStreak = 0;
  }

  state.customersServed++;
  state.customersServedThisSession++;
  state.totalStarsThisSession += reaction.stars;

  const screen = el('div', { class: 'screen result-screen' });

  // お客さんリアクション
  const customerReaction = el('div', { class: `customer-reaction ${reaction.class}` });
  customerReaction.appendChild(el('div', { class: 'reaction-face pop-in', text: reaction.emoji }));
  customerReaction.appendChild(el('div', { class: 'reaction-text', text: reaction.text }));
  screen.appendChild(customerReaction);

  // 星評価
  const stars = createStars(reaction.stars);
  stars.classList.add('pop-in');
  screen.appendChild(stars);

  // バーガー比較
  const compareArea = el('div', { class: 'compare-area' });
  const correctSide = el('div', { class: 'compare-side' });
  correctSide.appendChild(el('div', { class: 'compare-label', text: 'ちゅうもん' }));
  correctSide.appendChild(createBurgerStack(correct, BURGER_INGREDIENTS));
  const playerSide = el('div', { class: 'compare-side' });
  playerSide.appendChild(el('div', { class: 'compare-label', text: 'あなた' }));
  playerSide.appendChild(createBurgerStack(stacked, BURGER_INGREDIENTS));
  compareArea.appendChild(correctSide);
  compareArea.appendChild(playerSide);
  screen.appendChild(compareArea);

  if (reaction === REACTIONS.perfect) {
    setTimeout(() => showSparkles(screen), 300);
  }

  // アルバムに保存
  state.album.push({
    recipe: 'burger',
    name: order.name,
    emoji: '🍔',
    stars: reaction.stars,
    timestamp: Date.now(),
  });

  const btnRow = el('div', { class: 'btn-row' });
  btnRow.appendChild(createButton('🍔 つぎのおきゃくさん', () => {
    playClick();
    state.shopOrderIndex++;
    showNextCustomer(container, state, switchScene);
  }, 'btn-primary'));
  btnRow.appendChild(createButton('🏠 おわる', () => {
    playClick();
    switchScene('title');
  }));
  screen.appendChild(btnRow);
  container.appendChild(screen);
}

function showShopProgress(container, state, switchScene) {
  clearContainer(container);
  const screen = el('div', { class: 'screen progress-screen' });

  const title = el('h2', { class: 'screen-title', text: '📊 きょうの せいせき' });
  screen.appendChild(title);

  const stats = el('div', { class: 'stats-area' });
  stats.appendChild(el('div', { class: 'stat-item', html: `😊 おきゃくさん: <strong>${state.customersServedThisSession}にん</strong>` }));
  stats.appendChild(el('div', { class: 'stat-item', html: `⭐ あつめたほし: <strong>${state.totalStarsThisSession}こ</strong>` }));
  if (state.perfectStreak >= 2) {
    stats.appendChild(el('div', { class: 'stat-item highlight', html: `🌟 れんぞくパーフェクト: <strong>${state.perfectStreak}かい</strong>` }));
  }
  screen.appendChild(stats);

  const message = el('p', { class: 'progress-message', text: 'よくがんばったね！まだまだ おきゃくさんが まってるよ！' });
  screen.appendChild(message);

  const btnRow = el('div', { class: 'btn-row' });
  btnRow.appendChild(createButton('🍔 つづける', () => {
    playClick();
    state.shopOrderIndex++;
    showNextCustomer(container, state, switchScene);
  }, 'btn-primary'));
  btnRow.appendChild(createButton('🏠 おわる', () => {
    playClick();
    switchScene('title');
  }));
  screen.appendChild(btnRow);
  container.appendChild(screen);
}
