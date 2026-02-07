// data.js - ゲームデータ・定数

export const RECIPES = {
  hamburger: {
    id: 'hamburger',
    name: '目だらけハンバーグ',
    emoji: '🍔',
    steps: ['knead', 'shape', 'grill', 'eyes', 'plate'],
    stepNames: ['こねる', 'かたちをつくる', 'やく', '目をつける', 'もりつけ'],
    stepActions: ['タップれんだ！', 'タップれんだ！', 'おしつづける！', 'タップで目をのせよう！', 'トッピングをえらぼう！'],
    hasEyes: true,
  },
  potato: {
    id: 'potato',
    name: 'ポテト',
    emoji: '🍟',
    steps: ['cut', 'fry', 'salt'],
    stepNames: ['きる', 'あげる', 'しおをふる'],
    stepActions: ['タップれんだ！', 'おしつづける！', 'タップれんだ！'],
    hasEyes: false,
  },
  steak: {
    id: 'steak',
    name: 'お肉ステーキ',
    emoji: '🥩',
    steps: ['chooseMeat', 'grillSteak', 'sauce'],
    stepNames: ['おにくをえらぶ', 'やく', 'ソースをかける'],
    stepActions: ['タップでえらぼう！', 'おしつづける！', 'タップでえらぼう！'],
    hasEyes: false,
  },
  cheese: {
    id: 'cheese',
    name: 'チーズもりあわせ',
    emoji: '🧀',
    steps: ['chooseCheese', 'plateCheese'],
    stepNames: ['チーズをえらぶ', 'もりつける'],
    stepActions: ['タップでえらぼう！', 'タップでならべよう！'],
    hasEyes: false,
  },
};

export const BURGER_INGREDIENTS = [
  { id: 'bun_bottom', name: 'パン（下）', emoji: '🟫', category: 'bun' },
  { id: 'lettuce', name: 'レタス', emoji: '🥬', category: 'veggie' },
  { id: 'patty', name: 'お肉', emoji: '🥩', category: 'meat' },
  { id: 'cheese', name: 'チーズ', emoji: '🧀', category: 'dairy' },
  { id: 'tomato', name: 'トマト', emoji: '🍅', category: 'veggie' },
  { id: 'onion', name: 'たまねぎ', emoji: '🧅', category: 'veggie' },
  { id: 'bun_top', name: 'パン（上）', emoji: '🍞', category: 'bun' },
  { id: 'eye', name: '目', emoji: '👁️', category: 'special' },
];

export const ORDERS = [
  { level: 1, name: 'シンプルバーガー', ingredients: ['bun_bottom', 'patty', 'bun_top'], dialogue: 'ハンバーガーください！', timeLimit: 30 },
  { level: 1, name: 'シンプルバーガー', ingredients: ['bun_bottom', 'patty', 'bun_top'], dialogue: 'シンプルなのがいいな！', timeLimit: 30 },
  { level: 2, name: 'チーズバーガー', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], dialogue: 'チーズバーガーください！チーズ多めで！', timeLimit: 25 },
  { level: 2, name: 'レタスバーガー', ingredients: ['bun_bottom', 'lettuce', 'patty', 'bun_top'], dialogue: 'レタスバーガーおねがい！', timeLimit: 25 },
  { level: 3, name: 'デラックスバーガー', ingredients: ['bun_bottom', 'lettuce', 'patty', 'cheese', 'tomato', 'bun_top'], dialogue: 'デラックスバーガーおねがいします！', timeLimit: 25 },
  { level: 3, name: 'ダブルチーズ', ingredients: ['bun_bottom', 'patty', 'cheese', 'cheese', 'bun_top'], dialogue: 'チーズダブルでおねがい！', timeLimit: 25 },
  { level: 4, name: 'スペシャルバーガー', ingredients: ['bun_bottom', 'lettuce', 'patty', 'patty', 'cheese', 'tomato', 'onion', 'bun_top'], dialogue: 'お肉ダブルのスペシャルで！', timeLimit: 22 },
  { level: 5, name: '目だらけバーガー', ingredients: ['bun_bottom', 'lettuce', 'patty', 'cheese', 'eye', 'eye', 'eye', 'tomato', 'bun_top'], dialogue: '目だらけバーガーください！！👁️', timeLimit: 25 },
];

export const REACTIONS = {
  perfect: { stars: 3, text: 'せかいいち おいしい！！', emoji: '🤩', class: 'perfect' },
  good: { stars: 2, text: 'おいしい！ありがとう！', emoji: '😊', class: 'good' },
  ok: { stars: 1, text: 'うん、たべられるよ', emoji: '😐', class: 'ok' },
  miss: { stars: 0, text: 'ちょっと ちがうかな…？\nでも たのしかったよ！', emoji: '😅', class: 'miss' },
};

export const TOPPINGS = [
  { id: 'cheese', emoji: '🧀', name: 'チーズ' },
  { id: 'lettuce', emoji: '🥬', name: 'レタス' },
  { id: 'tomato', emoji: '🍅', name: 'トマト' },
  { id: 'onion', emoji: '🧅', name: 'たまねぎ' },
];

export const SAUCES = [
  { id: 'demi', name: 'デミグラスソース', emoji: '🟤' },
  { id: 'teriyaki', name: 'てりやきソース', emoji: '🍯' },
  { id: 'garlic', name: 'ガーリックソース', emoji: '🧄' },
  { id: 'ponzu', name: 'ポンずソース', emoji: '🍋' },
];

export const CHEESE_TYPES = [
  { id: 'cheddar', name: 'チェダー', emoji: '🧀', color: '#FFA500' },
  { id: 'mozzarella', name: 'モッツァレラ', emoji: '🧀', color: '#FFFACD' },
  { id: 'camembert', name: 'カマンベール', emoji: '🧀', color: '#FFF8DC' },
  { id: 'gouda', name: 'ゴーダ', emoji: '🧀', color: '#FFD700' },
  { id: 'blue', name: 'ブルーチーズ', emoji: '🧀', color: '#87CEEB' },
];

export const MEAT_TYPES = [
  { id: 'wagyu', name: 'わぎゅう', emoji: '🥩' },
  { id: 'chicken', name: 'とりにく', emoji: '🍗' },
  { id: 'pork', name: 'ぶたにく', emoji: '🥓' },
];

export const DONENESS_LEVELS = [
  { id: 'rare', name: 'レア', taps: 8 },
  { id: 'medium', name: 'ミディアム', taps: 15 },
  { id: 'welldone', name: 'ウェルダン', taps: 25 },
];

export const CUSTOMER_FACES = ['😊', '😄', '🥰', '😎', '🤗', '👦', '👧', '👨', '👩', '🧒'];

export const ACHIEVEMENTS = [
  { id: 'eyes100', name: '目100こ ハンバーグ たっせい！', icon: '👁️', check: s => s.maxEyes >= 100 },
  { id: 'serve10', name: '10にんの おきゃくさんを まんぞくさせた！', icon: '⭐', check: s => s.customersServed >= 10 },
  { id: 'allRecipes', name: 'ぜんぶの りょうりを つくった！', icon: '🏆', check: s => s.recipesCompleted.size >= 4 },
  { id: 'perfectStreak', name: '3れんぞく パーフェクト！', icon: '🌟', check: s => s.perfectStreak >= 3 },
  { id: 'firstCook', name: 'はじめての りょうり！', icon: '🍳', check: s => s.album.length >= 1 },
];

export const EYE_COMMENTS = [
  { min: 0, max: 5, text: 'ひかえめな おめめ！' },
  { min: 6, max: 15, text: 'いいかんじの おめめ！' },
  { min: 16, max: 30, text: 'たくさん おめめ！' },
  { min: 31, max: 50, text: 'めだらけ！すごい！' },
  { min: 51, max: 99, text: 'めめめめめめ！！' },
  { min: 100, max: Infinity, text: 'せかいいちの めだらけハンバーグ！！！' },
];
