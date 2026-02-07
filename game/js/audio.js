// audio.js - Web Audio API サウンド管理

let ctx = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

export function resumeAudio() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function playNoise(duration, volume = 0.15) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3000;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start();
  source.stop(c.currentTime + duration);
}

// ジュージュー音（焼く）
export function playSizzle() {
  playNoise(0.5, 0.12);
  playTone(120, 0.3, 'sawtooth', 0.05);
}

// パチパチ音（揚げる）
export function playFry() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playNoise(0.08, 0.15), i * 60);
  }
}

// トントン音（切る）
export function playChop() {
  playTone(200, 0.1, 'square', 0.2);
  setTimeout(() => playTone(180, 0.08, 'square', 0.15), 100);
}

// ポン！（食材を置く）
export function playPop() {
  playTone(600, 0.15, 'sine', 0.25);
  playTone(800, 0.1, 'sine', 0.15);
}

// ぴょん！（目をつける）
export function playBoing() {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(500, c.currentTime + 0.2);
  gain.gain.setValueAtTime(0.25, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.25);
}

// ファンファーレ（完成）
export function playFanfare() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'square', 0.15), i * 150);
  });
}

// チャイム（来店）
export function playChime() {
  playTone(880, 0.3, 'sine', 0.2);
  setTimeout(() => playTone(1108, 0.3, 'sine', 0.2), 200);
  setTimeout(() => playTone(1320, 0.5, 'sine', 0.2), 400);
}

// ボタンクリック
export function playClick() {
  playTone(500, 0.08, 'sine', 0.15);
}

// 成功音
export function playSuccess() {
  playTone(523, 0.15, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 120);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.2), 240);
}

// 失敗音（やさしい音）
export function playMiss() {
  playTone(350, 0.2, 'sine', 0.15);
  setTimeout(() => playTone(300, 0.3, 'sine', 0.15), 200);
}

// こねる音
export function playSquish() {
  playNoise(0.12, 0.1);
  playTone(150, 0.12, 'sine', 0.08);
}

// しお音
export function playSprinkle() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => playNoise(0.04, 0.08), i * 40);
  }
}

// タイマー警告
export function playTick() {
  playTone(1000, 0.05, 'square', 0.1);
}
