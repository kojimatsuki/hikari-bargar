// ui.js - UI描画・食べ物の見た目・リアクション

export function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else e.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') e.appendChild(document.createTextNode(child));
    else if (child) e.appendChild(child);
  }
  return e;
}

export function clearContainer(container) {
  container.innerHTML = '';
}

// 目がキョロキョロ動くアニメーション
export function createEye(size = 40) {
  const eye = el('span', { class: 'eye', style: { fontSize: size + 'px' } }, ['👁️']);
  const delay = Math.random() * 2;
  const duration = 1.5 + Math.random() * 1.5;
  eye.style.animationDelay = delay + 's';
  eye.style.animationDuration = duration + 's';
  return eye;
}

// 目だらけハンバーグの表示
export function createEyeHamburger(eyeCount, size = 'large') {
  const sizeClass = size === 'large' ? 'hamburger-large' : 'hamburger-small';
  const wrap = el('div', { class: `eye-hamburger ${sizeClass}` });
  const burger = el('div', { class: 'burger-base' }, ['🍔']);
  wrap.appendChild(burger);
  const eyeContainer = el('div', { class: 'eye-container' });
  for (let i = 0; i < eyeCount; i++) {
    const eyeEl = createEye(size === 'large' ? 28 : 16);
    const angle = (i / Math.max(eyeCount, 1)) * Math.PI * 2;
    const radius = size === 'large' ? 30 + (i % 3) * 18 : 15 + (i % 3) * 10;
    eyeEl.style.position = 'absolute';
    eyeEl.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
    eyeEl.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
    eyeEl.style.transform = 'translate(-50%, -50%)';
    eyeContainer.appendChild(eyeEl);
  }
  wrap.appendChild(eyeContainer);
  return wrap;
}

// タイトル画面の大きなハンバーグ
export function createTitleHamburger() {
  const wrap = el('div', { class: 'title-hamburger' });
  const burger = el('div', { class: 'title-burger-emoji' }, ['🍔']);
  wrap.appendChild(burger);
  const eyes = [
    { x: -35, y: -20 }, { x: 0, y: -35 }, { x: 35, y: -20 },
    { x: -20, y: 10 }, { x: 20, y: 10 }, { x: 0, y: 0 },
  ];
  eyes.forEach(pos => {
    const eyeEl = createEye(32);
    eyeEl.style.position = 'absolute';
    eyeEl.style.left = `calc(50% + ${pos.x}px)`;
    eyeEl.style.top = `calc(50% + ${pos.y}px)`;
    eyeEl.style.transform = 'translate(-50%, -50%)';
    wrap.appendChild(eyeEl);
  });
  return wrap;
}

// プログレスバー
export function createProgressBar() {
  const bar = el('div', { class: 'progress-bar' });
  const fill = el('div', { class: 'progress-fill' });
  bar.appendChild(fill);
  return { bar, fill };
}

export function updateProgressBar(fill, percent) {
  fill.style.width = Math.min(100, Math.max(0, percent)) + '%';
}

// キラキラ演出
export function showSparkles(container) {
  for (let i = 0; i < 12; i++) {
    const sparkle = el('div', { class: 'sparkle', text: '✨' });
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 0.5 + 's';
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1500);
  }
}

// 火の演出
export function showFlames(container) {
  const flames = el('div', { class: 'flames' });
  for (let i = 0; i < 5; i++) {
    const flame = el('span', { class: 'flame', text: '🔥' });
    flame.style.animationDelay = Math.random() * 0.3 + 's';
    flame.style.left = 20 + Math.random() * 60 + '%';
    flames.appendChild(flame);
  }
  container.appendChild(flames);
  return flames;
}

// 煙の演出
export function showSmoke(container) {
  const smoke = el('div', { class: 'smoke-container' });
  for (let i = 0; i < 3; i++) {
    const s = el('span', { class: 'smoke', text: '💨' });
    s.style.animationDelay = Math.random() * 0.5 + 's';
    s.style.left = 30 + Math.random() * 40 + '%';
    smoke.appendChild(s);
  }
  container.appendChild(smoke);
  return smoke;
}

// 油パチパチ演出
export function showOilSplash(container) {
  for (let i = 0; i < 6; i++) {
    const drop = el('div', { class: 'oil-drop' });
    drop.style.left = 20 + Math.random() * 60 + '%';
    drop.style.animationDelay = Math.random() * 0.3 + 's';
    container.appendChild(drop);
    setTimeout(() => drop.remove(), 800);
  }
}

// ボタン作成
export function createButton(text, onClick, className = '') {
  return el('button', {
    class: `game-btn ${className}`.trim(),
    text: text,
    onclick: onClick,
  });
}

// 星評価表示
export function createStars(count) {
  let str = '';
  for (let i = 0; i < 3; i++) {
    str += i < count ? '⭐' : '☆';
  }
  return el('div', { class: 'stars', text: str });
}

// 料理完成プレート表示
export function createDishDisplay(recipe, extras = {}) {
  const dish = el('div', { class: 'dish-display' });
  const mainEmoji = el('div', { class: 'dish-emoji', text: recipe.emoji });
  dish.appendChild(mainEmoji);
  if (extras.eyeCount && extras.eyeCount > 0) {
    const eyeWrap = el('div', { class: 'dish-eyes' });
    const displayCount = Math.min(extras.eyeCount, 30);
    for (let i = 0; i < displayCount; i++) {
      const eyeEl = createEye(20);
      eyeEl.style.position = 'absolute';
      const angle = (i / displayCount) * Math.PI * 2;
      const r = 25 + (i % 3) * 12;
      eyeEl.style.left = `calc(50% + ${Math.cos(angle) * r}px)`;
      eyeEl.style.top = `calc(50% + ${Math.sin(angle) * r}px)`;
      eyeEl.style.transform = 'translate(-50%, -50%)';
      eyeWrap.appendChild(eyeEl);
    }
    dish.appendChild(eyeWrap);
  }
  if (extras.toppings && extras.toppings.length > 0) {
    const toppingRow = el('div', { class: 'topping-row' });
    extras.toppings.forEach(t => {
      toppingRow.appendChild(el('span', { class: 'topping-emoji', text: t.emoji }));
    });
    dish.appendChild(toppingRow);
  }
  if (extras.sauce) {
    dish.appendChild(el('div', { class: 'sauce-label', text: extras.sauce.emoji + ' ' + extras.sauce.name }));
  }
  return dish;
}

// バーガーのスタック表示
export function createBurgerStack(ingredients, ingredientData) {
  const stack = el('div', { class: 'burger-stack' });
  ingredients.forEach((id, i) => {
    const item = ingredientData.find(d => d.id === id);
    if (!item) return;
    const layer = el('div', {
      class: 'burger-layer',
      text: item.emoji,
      style: { animationDelay: i * 0.1 + 's' },
    });
    stack.appendChild(layer);
  });
  return stack;
}

// タイマーバー
export function createTimerBar() {
  const bar = el('div', { class: 'timer-bar' });
  const fill = el('div', { class: 'timer-fill' });
  bar.appendChild(fill);
  return { bar, fill };
}

export function updateTimerBar(fill, percent) {
  fill.style.width = Math.max(0, percent) + '%';
  if (percent < 30) fill.classList.add('timer-danger');
  else fill.classList.remove('timer-danger');
}
