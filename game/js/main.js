// main.js - ゲーム初期化・モード選択

import { renderTitle, renderModeSelect, renderAlbum } from './scenes.js';
import { startKitchenMenu } from './kitchen.js';
import { startShop } from './shop.js';
import { resumeAudio } from './audio.js';

// ゲーム状態
const state = {
  // キッチンモード
  currentRecipe: null,
  cookingStep: 0,
  eyeCount: 0,
  toppings: [],
  selectedMeat: null,
  selectedSauce: null,
  selectedCheeses: [],
  // ショップモード
  shopOrderIndex: 0,
  customersServed: 0,
  customersServedThisSession: 0,
  totalStarsThisSession: 0,
  perfectStreak: 0,
  currentPerfectStreak: 0,
  // コレクション
  album: [],
  maxEyes: 0,
  recipesCompleted: new Set(),
  achievements: new Set(),
};

const container = document.getElementById('game');

function switchScene(sceneName) {
  resumeAudio();
  switch (sceneName) {
    case 'title':
      renderTitle(container, state, switchScene);
      break;
    case 'modeSelect':
      renderModeSelect(container, state, switchScene);
      break;
    case 'kitchen':
      startKitchenMenu(container, state, switchScene);
      break;
    case 'shop':
      startShop(container, state, switchScene);
      break;
    case 'album':
      renderAlbum(container, state, switchScene);
      break;
    default:
      renderTitle(container, state, switchScene);
  }
}

// 初回タッチでAudio解禁
document.addEventListener('pointerdown', () => resumeAudio(), { once: true });

// ゲーム開始
switchScene('title');
