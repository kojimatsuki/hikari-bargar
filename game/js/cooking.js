// cooking.js - 調理アクション（焼く/盛り付け/トッピング）

import { el, createProgressBar, updateProgressBar, showFlames, showSmoke, showOilSplash, createEye } from './ui.js';
import { playSizzle, playChop, playFry, playSquish, playBoing, playSprinkle, playPop } from './audio.js';

// タップ連打アクション（こねる・切る・塩など）
export function createTapAction(area, { target, emoji, soundFn, onComplete }) {
  let taps = 0;
  const wrap = el('div', { class: 'cooking-action tap-action' });
  const display = el('div', { class: 'action-display', text: emoji });
  const { bar, fill } = createProgressBar();
  const counter = el('div', { class: 'tap-counter', text: `${taps}/${target}` });
  const hint = el('div', { class: 'action-hint', text: 'タップ！' });

  display.classList.add('tappable');
  display.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    taps++;
    counter.textContent = `${taps}/${target}`;
    updateProgressBar(fill, (taps / target) * 100);
    display.classList.add('tap-bounce');
    setTimeout(() => display.classList.remove('tap-bounce'), 150);
    if (soundFn) soundFn();
    if (taps >= target) {
      display.style.pointerEvents = 'none';
      setTimeout(onComplete, 300);
    }
  });

  wrap.appendChild(display);
  wrap.appendChild(bar);
  wrap.appendChild(counter);
  wrap.appendChild(hint);
  area.appendChild(wrap);
  return wrap;
}

// 長押しアクション（焼く・揚げる）
export function createHoldAction(area, { target, emoji, type, onComplete }) {
  let progress = 0;
  let holding = false;
  let interval = null;
  const wrap = el('div', { class: 'cooking-action hold-action' });
  const display = el('div', { class: 'action-display', text: emoji });
  const { bar, fill } = createProgressBar();
  const hint = el('div', { class: 'action-hint', text: 'おしつづけて！' });
  let flamesEl = null;
  let smokeEl = null;

  function startHold() {
    if (holding || progress >= target) return;
    holding = true;
    display.classList.add('holding');
    if (type === 'grill') {
      flamesEl = showFlames(wrap);
    }
    interval = setInterval(() => {
      if (!holding) return;
      progress++;
      updateProgressBar(fill, (progress / target) * 100);
      if (type === 'grill') playSizzle();
      else if (type === 'fry') {
        playFry();
        showOilSplash(wrap);
      }
      if (progress >= target) {
        stopHold();
        smokeEl = showSmoke(wrap);
        setTimeout(onComplete, 500);
      }
    }, 200);
  }

  function stopHold() {
    holding = false;
    display.classList.remove('holding');
    if (interval) { clearInterval(interval); interval = null; }
    if (flamesEl) { flamesEl.remove(); flamesEl = null; }
  }

  display.classList.add('tappable');
  display.addEventListener('pointerdown', (e) => { e.preventDefault(); startHold(); });
  display.addEventListener('pointerup', stopHold);
  display.addEventListener('pointerleave', stopHold);
  display.addEventListener('pointercancel', stopHold);

  wrap.appendChild(display);
  wrap.appendChild(bar);
  wrap.appendChild(hint);
  area.appendChild(wrap);
  return { wrap, cleanup: stopHold };
}

// 目をつけるアクション
export function createEyeAction(area, { onAdd, onComplete }) {
  let count = 0;
  const wrap = el('div', { class: 'cooking-action eye-action' });
  const plateArea = el('div', { class: 'eye-plate' });
  const burgerBase = el('div', { class: 'eye-plate-burger', text: '🍔' });
  plateArea.appendChild(burgerBase);
  const eyeBtn = el('button', {
    class: 'game-btn eye-btn',
    html: '👁️ 目をつける',
    onclick: () => {
      count++;
      const eyeEl = createEye(22);
      eyeEl.style.position = 'absolute';
      const angle = (count / 8) * Math.PI * 2 + Math.random() * 0.5;
      const r = 20 + (count % 4) * 12 + Math.random() * 8;
      eyeEl.style.left = `calc(50% + ${Math.cos(angle) * r}px)`;
      eyeEl.style.top = `calc(50% + ${Math.sin(angle) * r}px)`;
      eyeEl.style.transform = 'translate(-50%, -50%)';
      eyeEl.classList.add('eye-pop');
      plateArea.appendChild(eyeEl);
      playBoing();
      counterEl.textContent = `目のかず: ${count}こ`;
      if (onAdd) onAdd(count);
    },
  });
  const counterEl = el('div', { class: 'eye-counter', text: '目のかず: 0こ' });
  const doneBtn = el('button', {
    class: 'game-btn btn-primary',
    text: 'かんせい！',
    onclick: () => onComplete(count),
  });
  const hint = el('div', { class: 'action-hint small', text: 'たくさんのせるほど ポイントアップ！' });

  wrap.appendChild(plateArea);
  wrap.appendChild(eyeBtn);
  wrap.appendChild(counterEl);
  wrap.appendChild(hint);
  wrap.appendChild(doneBtn);
  area.appendChild(wrap);
  return wrap;
}

// トッピング選択アクション
export function createToppingAction(area, { toppings, onComplete }) {
  const selected = [];
  const wrap = el('div', { class: 'cooking-action topping-action' });
  const title = el('div', { class: 'action-title', text: 'トッピングをえらぼう！' });
  const grid = el('div', { class: 'topping-grid' });

  toppings.forEach(t => {
    const btn = el('button', {
      class: 'topping-btn',
      html: `${t.emoji}<br><span class="topping-name">${t.name}</span>`,
      onclick: () => {
        const idx = selected.findIndex(s => s.id === t.id);
        if (idx >= 0) {
          selected.splice(idx, 1);
          btn.classList.remove('selected');
        } else {
          selected.push(t);
          btn.classList.add('selected');
          playPop();
        }
      },
    });
    grid.appendChild(btn);
  });

  const doneBtn = el('button', {
    class: 'game-btn btn-primary',
    text: 'もりつけかんせい！',
    onclick: () => onComplete(selected),
  });

  wrap.appendChild(title);
  wrap.appendChild(grid);
  wrap.appendChild(doneBtn);
  area.appendChild(wrap);
  return wrap;
}

// 選択アクション（肉の種類・ソース・チーズなど）
export function createChoiceAction(area, { title, choices, multiSelect, onComplete }) {
  const selected = multiSelect ? [] : [null];
  const wrap = el('div', { class: 'cooking-action choice-action' });
  const titleEl = el('div', { class: 'action-title', text: title });
  const grid = el('div', { class: 'choice-grid' });
  const buttons = [];

  choices.forEach(c => {
    const btn = el('button', {
      class: 'choice-btn',
      html: `${c.emoji}<br><span class="choice-name">${c.name}</span>`,
      onclick: () => {
        playPop();
        if (multiSelect) {
          const idx = selected.indexOf(c);
          if (idx >= 0) {
            selected.splice(idx, 1);
            btn.classList.remove('selected');
          } else {
            selected.push(c);
            btn.classList.add('selected');
          }
        } else {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selected[0] = c;
        }
      },
    });
    buttons.push(btn);
    grid.appendChild(btn);
  });

  const doneBtn = el('button', {
    class: 'game-btn btn-primary',
    text: 'けってい！',
    onclick: () => {
      const result = multiSelect ? [...selected] : selected[0];
      if (!result || (Array.isArray(result) && result.length === 0)) return;
      onComplete(result);
    },
  });

  wrap.appendChild(titleEl);
  wrap.appendChild(grid);
  wrap.appendChild(doneBtn);
  area.appendChild(wrap);
  return wrap;
}
