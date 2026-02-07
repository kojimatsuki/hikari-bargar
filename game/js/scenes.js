// scenes.js - シーン管理（タイトル/モード選択/結果/アルバム）

import { ACHIEVEMENTS } from './data.js';
import { el, clearContainer, createButton, createTitleHamburger, createEyeHamburger } from './ui.js';
import { playClick, playFanfare } from './audio.js';
import { startKitchenMenu } from './kitchen.js';
import { startShop } from './shop.js';

// タイトル画面
export function renderTitle(container, state, switchScene) {
  clearContainer(container);
  const screen = el('div', { class: 'screen title-screen' });

  const hamburger = createTitleHamburger();
  screen.appendChild(hamburger);

  const title = el('h1', { class: 'game-title' });
  title.innerHTML = '目だらけハンバーグ<br><span class="subtitle">〜どうぞ めしあがれ〜</span>';
  screen.appendChild(title);

  const catchcopy = el('p', { class: 'catchcopy bounce-text', text: '🍽️ どうぞ めしあがれ！' });
  screen.appendChild(catchcopy);

  const startBtn = createButton('はじめる', () => {
    playClick();
    switchScene('modeSelect');
  }, 'btn-primary btn-large');
  screen.appendChild(startBtn);

  // アルバムボタン（料理がある場合）
  if (state.album.length > 0) {
    const albumBtn = createButton('📖 アルバム', () => {
      playClick();
      switchScene('album');
    });
    screen.appendChild(albumBtn);
  }

  container.appendChild(screen);
}

// モード選択画面
export function renderModeSelect(container, state, switchScene) {
  clearContainer(container);
  const screen = el('div', { class: 'screen mode-select-screen' });

  const title = el('h2', { class: 'screen-title', text: 'あそびかたを えらぼう！' });
  screen.appendChild(title);

  const modeGrid = el('div', { class: 'mode-grid' });

  // じゆうキッチン
  const kitchenCard = el('div', { class: 'mode-card kitchen-card', onclick: () => {
    playClick();
    startKitchenMenu(container, state, switchScene);
  }});
  kitchenCard.appendChild(el('div', { class: 'mode-icon', text: '🏠' }));
  kitchenCard.appendChild(el('h3', { class: 'mode-name', text: 'じゆうキッチン' }));
  kitchenCard.appendChild(el('p', { class: 'mode-desc', text: 'すきな りょうりを じゆうに つくろう！' }));
  modeGrid.appendChild(kitchenCard);

  // バーガーショップ
  const shopCard = el('div', { class: 'mode-card shop-card', onclick: () => {
    playClick();
    startShop(container, state, switchScene);
  }});
  shopCard.appendChild(el('div', { class: 'mode-icon', text: '🍔' }));
  shopCard.appendChild(el('h3', { class: 'mode-name', text: 'バーガーショップ' }));
  shopCard.appendChild(el('p', { class: 'mode-desc', text: 'ちゅうもんどおりに ハンバーガーを つくろう！' }));
  modeGrid.appendChild(shopCard);

  screen.appendChild(modeGrid);

  const backBtn = createButton('🔙 もどる', () => {
    playClick();
    switchScene('title');
  });
  screen.appendChild(backBtn);

  container.appendChild(screen);
}

// アルバム画面
export function renderAlbum(container, state, switchScene) {
  clearContainer(container);
  const screen = el('div', { class: 'screen album-screen' });

  const title = el('h2', { class: 'screen-title', text: '📖 りょうりアルバム' });
  screen.appendChild(title);

  if (state.album.length === 0) {
    screen.appendChild(el('p', { class: 'album-empty', text: 'まだ りょうりが ないよ。つくってみよう！' }));
  } else {
    const grid = el('div', { class: 'album-grid' });
    [...state.album].reverse().forEach((dish, i) => {
      const card = el('div', { class: 'album-card' });
      const emojiEl = el('div', { class: 'album-emoji', text: dish.emoji });
      card.appendChild(emojiEl);
      if (dish.eyeCount && dish.eyeCount > 0) {
        card.appendChild(el('div', { class: 'album-eyes', text: `👁️×${dish.eyeCount}` }));
      }
      card.appendChild(el('div', { class: 'album-name', text: dish.name }));
      if (dish.stars !== undefined) {
        let starStr = '';
        for (let s = 0; s < 3; s++) starStr += s < dish.stars ? '⭐' : '☆';
        card.appendChild(el('div', { class: 'album-stars', text: starStr }));
      }
      grid.appendChild(card);
    });
    screen.appendChild(grid);
  }

  // 実績
  const achievementsSection = el('div', { class: 'achievements-section' });
  achievementsSection.appendChild(el('h3', { class: 'section-title', text: '🏆 じっせき' }));
  const achGrid = el('div', { class: 'achievement-grid' });
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = ach.check(state);
    const achCard = el('div', { class: `achievement-card ${unlocked ? 'unlocked' : 'locked'}` });
    achCard.appendChild(el('div', { class: 'ach-icon', text: unlocked ? ach.icon : '🔒' }));
    achCard.appendChild(el('div', { class: 'ach-name', text: unlocked ? ach.name : '???' }));
    achGrid.appendChild(achCard);
    if (unlocked && !state.achievements.has(ach.id)) {
      state.achievements.add(ach.id);
    }
  });
  achievementsSection.appendChild(achGrid);
  screen.appendChild(achievementsSection);

  const backBtn = createButton('🔙 もどる', () => {
    playClick();
    switchScene('title');
  });
  screen.appendChild(backBtn);

  container.appendChild(screen);
}
