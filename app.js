'use strict';
/* =========================================================
   關主模擬器｜品牌色彩挑戰  © 2026 啾啾菇
   ========================================================= */
const $ = s => document.querySelector(s);
const app = $('#app');
const IMG = n => `assets/${n}.webp`;
const ANIMALS_A = ['shiba', 'cat', 'rabbit', 'tanuki'];
const ANIMALS_B = ['fox', 'penguin', 'bear', 'otter', 'hedgehog'];
const ALL_ANIMALS = [...ANIMALS_A, ...ANIMALS_B];
const ZH_NAME = { shiba: '柴犬', cat: '三花貓', rabbit: '兔子', tanuki: '狸貓', fox: '狐狸', penguin: '企鵝', bear: '小熊', otter: '水獺', hedgehog: '刺蝟' };
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const chance = p => Math.random() < p;
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clone = o => JSON.parse(JSON.stringify(o));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const numWord = n => NUM_WORDS[n] || String(n);

/* ---------- storage ---------- */
const KEY = 'gz-host-sim-v1';
let DB = { history: { host: [], helper: [] }, stats: {}, stickers: [], autoSpeak: true, grammarOn: true };
try { Object.assign(DB, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* 無法讀取就用預設 */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* ignore */ } };

/* ---------- icons ---------- */
const ICON = {
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21"/>',
  stop: '<rect x="7" y="7" width="10" height="10" rx="2"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  sound: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  repeat: '<path d="M4 12a8 8 0 0 1 14-5l2 2"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M4 20v-5h5"/>',
  next: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  skip: '<path d="M5 5l8 7-8 7z"/><line x1="18" y1="5" x2="18" y2="19"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
};
const ic = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
function heartsHTML(n, total = 10) {
  let s = '';
  for (let i = 0; i < total; i++) s += `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="${i < n ? '#E86A86' : '#EFE3DA'}" stroke="rgba(160,90,100,.35)" stroke-width="1.2"/></svg>`;
  return `<span class="hearts" role="img" aria-label="好感度 ${n} / ${total}">${s}</span>`;
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

/* =========================================================
   情境產生器
   ========================================================= */
const colorsSentence = keys => {
  const w = [...keys].map(k => COLORS[k].en);
  const s = w.length === 1 ? w[0] : w.length === 2 ? w.join(' and ') : w.slice(0, -1).join(', ') + ', and ' + w[w.length - 1];
  return cap(s) + '!';
};
const colorsZh = keys => [...keys].map(k => COLORS[k].zh).join('、');
const L = (key, extra = {}) => { const d = LINES[key]; return Object.assign({ key, sec: d.sec, type: d.type, en: d.en, zh: d.zh, sit: d.sit, alts: [] }, extra); };
const D = (key, sec, type, en, zh, sit, extra = {}) => Object.assign({ key, sec, type, en, zh, sit, alts: [] }, extra);
const JAPAN_LINK = ['2-2', '2-3', '1-4', '3-4', 'W-2', '3-3'];

function genHost() {
  const steps = [];
  const sizeB = chance(.7) ? 5 : 4;
  let W = { sizeB, bandsOn: false, board: 'idle', side: null, score: null, host: 'wave', raise: null, mood: null };
  const push = (st, patch = {}) => { st.sc = clone({ ...W, ...patch }); steps.push(st); };

  // 01 開場
  push(L('welcome'), { host: 'wave', mood: 'happy' });
  if (chance(.65)) push(L('havefun'), { host: 'cheer', mood: 'happy' });
  push(L('playgame'), { host: 'cheer' });
  push(D('grouping', '01 開場', 'base',
    sizeB === 5 ? 'Four people here, five people there.' : 'Four people here, four people there.',
    `這邊 4 位，那邊 ${sizeB} 位。`,
    `一共 ${4 + sizeB} 位同學。把他們分成兩邊：一邊 4 位、另一邊 ${sizeB} 位。`), { host: 'point' });
  push(L('teams'), { host: 'point' });
  // 02 手環
  push(L('helpers'), { host: 'wave', side: { kind: 'basket' } });
  W.bandsOn = true;
  // 03 規則
  const warm = pick(CARDS.filter(c => c.round === 'W'));
  push(L('gamename'), { host: 'cheer' });
  push(L('firstlook'), { host: 'point', board: warm.colors });
  push(L('thenbw'), { host: 'card', side: { kind: 'card', card: warm.code, reveal: false } });
  push(L('tellhow'), { host: 'card', side: { kind: 'card', card: warm.code, reveal: false } });
  push(L('raisehand'), { host: 'point', raise: { colors: warm.colors } });
  push(L('onepoint'), { host: 'point' });
  push(L('nominus'), { host: 'wave', mood: 'conf' });
  push(L('morewins'), { host: 'cheer' });
  // 04 熱身
  push(L('practice'), { host: 'card', side: { kind: 'card', card: warm.code, reveal: false } });
  push(L('nopoints'), { host: 'point', side: { kind: 'card', card: warm.code, reveal: false } });

  // 05–08 三回合
  const cards = { 1: pick(CARDS.filter(c => c.round === '1')), 2: pick(CARDS.filter(c => c.round === '2')), 3: pick(CARDS.filter(c => c.round === '3')) };
  const dist = {};
  ['qintro', 'look20', 'left10', 'timesup', 'sec10', 'keepup', 'toomany', 'handsdown', 'check', 'endround'].forEach(k => { dist[k] = 1 + rnd(3); });
  const has = (k, r) => dist[k] === r;
  let sa = 0, sb = 0, saidHarder = false;
  W.score = { A: 0, B: 0 };
  for (const r of [1, 2, 3]) {
    const c = cards[r]; const n = c.colors.length; const nw = numWord(n);
    W.side = null; W.board = c.colors; W.raise = null;
    const intro = { 1: ['Round one! Two-color logos.', '第一回合！兩色 Logo。'], 2: ['Round two! Three or four colors.', '第二回合！三到四色。'], 3: ['Round three! The hardest round!', '第三回合！最難的一回合！'] }[r];
    push(D('round', '05 觀察', 'base', intro[0], intro[1], `第 ${r} 回合開始了！${r === 1 ? '這回合都是兩色的 Logo。' : r === 2 ? '這回合是三到四色的 Logo。' : '這是最難的一回合。'}宣布回合開始。`), { host: 'cheer' });
    if (has('look20', r)) push(L('look20'), { host: 'point', side: { kind: 'hourglass' } });
    if (has('left10', r)) push(L('left10'), { host: 'point', side: { kind: 'hourglass' } });
    if (has('timesup', r)) push(L('timesup'), { host: 'cheer', side: { kind: 'hourglass' } });
    W.board = 'idle';
    W.side = { kind: 'card', card: c.code, reveal: false };
    const qn = 1 + rnd(4);
    if (has('qintro', r)) push(D('qintro', '06 出題', 'base', `Question ${numWord(qn)}! Look at this logo!`, `第${NUM_ZH[qn]}題！請看這個 Logo！`, `第 ${qn} 題！舉起黑白題卡，請大家看這個 Logo。`), { host: 'card' });
    push(D('hascolors', '06 出題', 'base', `This logo has ${nw} colors.`, `這個 Logo 有 ${n} 個顏色。`, `題卡上寫著 ${n} colors。告訴大家這個 Logo 有幾個顏色。`), { host: 'card' });
    push(D('upto', '06 出題', 'base', `Raise up to ${nw}!`, `最多舉 ${n} 個！`, `提醒大家：這題最多只能舉 ${n} 隻手。`), { host: 'point' });
    if (has('sec10', r)) push(L('sec10'), { host: 'point' });
    W.raise = { colors: c.colors };
    if (chance(.35)) push(L('think'), { host: 'point' });
    else if (chance(.35)) push(L('sure'), { host: 'point' });
    if (has('keepup', r)) push(L('keepup'), { host: 'cheer' });
    if (has('toomany', r)) push(L('toomany'), { host: 'point', raise: { colors: c.colors, extra: true } });
    if (has('handsdown', r)) push(L('handsdown'), { host: 'wave' });
    W.raise = null;
    if (has('check', r)) push(L('check'), { host: 'card' });
    W.side = { kind: 'card', card: c.code, reveal: true };
    push(D('colors', '07 公布', 'base', colorsSentence(c.colors), colorsZh(c.colors) + '！', '翻開題卡背面了！照著背面的顏色，念出這題的答案。', { mode: 'colors', colorKeys: c.colors }), { host: 'point' });
    push(D('brand', '07 公布', 'base', `This is ${c.say}.`, `這是${c.zh}。`, '介紹這是哪個品牌（看題卡背面的名字）。', { mode: 'brand', alts: c.alts.map(a => `This is ${a}.`), fact: c.fact }), { host: 'point' });
    const allRight = chance(.5);
    if (chance(.55)) push(allRight ? L('goodjob') : L('nicetry'), { host: allRight ? 'clap' : 'wave', mood: allRight ? 'happy' : 'conf' });
    if (JAPAN_LINK.includes(c.code) && chance(.6)) push(L('seenjapan'), { host: 'point' });
    else if (chance(.35)) push(L('knowbrand'), { host: 'point' });
    const pa = 1 + rnd(n), pb = 1 + rnd(n);
    sa += pa; sb += pb; W.score = { A: sa, B: sb };
    const ann = r === 1 ? ['A', 'B'] : [pick(['A', 'B'])];
    for (const t of ann) {
      const p = t === 'A' ? pa : pb;
      push(D('points', '08 計分', 'base', `Team ${t} gets ${numWord(p)} point${p > 1 ? 's' : ''}!`, `${t} 隊得 ${p} 分！`, `${t} 隊這題答對了 ${p} 個顏色，宣布 ${t} 隊得幾分。`), { host: 'cheer', side: { kind: 'scoreboard' } });
    }
    if (has('endround', r)) push(D('endround', '08 計分', 'base', `That's the end of round ${numWord(r)}!`, `第${NUM_ZH[r]}回合結束！`, `第 ${r} 回合的題目都出完了，宣布這回合結束。`), { host: 'wave', side: { kind: 'scoreboard' } });
    if (r < 3 && chance(.5)) {
      push(D('totals', '08 計分', 'ext', `Team A has ${numWord(sa)} points, Team B has ${numWord(sb)}.`, `A 隊 ${sa} 分，B 隊 ${sb} 分。`, `第 ${r} 回合後的分數：A 隊 ${sa} 分、B 隊 ${sb} 分。報一下目前比數。`, { alts: [`Team A has ${numWord(sa)} points, Team B has ${numWord(sb)} points.`] }), { host: 'point', side: { kind: 'scoreboard' } });
      if (Math.abs(sa - sb) <= 1 && chance(.8)) push(L('close'), { host: 'cheer', side: { kind: 'scoreboard' } });
    }
    if (r < 3 && !saidHarder && chance(.45)) { saidHarder = true; push(L('harder'), { host: 'cheer' }); }
  }
  // 09 最終
  W.side = { kind: 'scoreboard' }; W.board = 'idle';
  const tie = chance(.3);
  if (tie) { sb = sa; W.score = { A: sa, B: sb }; }
  push(L('gameend'), { host: 'clap' });
  push(L('finalscore'), { host: 'point' });
  let winner = sa > sb ? 'A' : sa < sb ? 'B' : null;
  if (tie) {
    push(L('tie'), { host: 'point' });
    push(L('onemore'), { host: 'card', side: { kind: 'card', card: pick(CARDS.filter(c => c.round === '3' && c.code !== cards[3].code)).code, reveal: false } });
    push(L('ready'), { host: 'cheer' });
    winner = pick(['A', 'B']);
    if (winner === 'A') sa += 1; else sb += 1;
    W.score = { A: sa, B: sb };
  }
  push(D('winner', '09 最終', 'base', `Team ${winner} wins!`, `${winner} 隊獲勝！`, `最後比數 A 隊 ${sa} 分、B 隊 ${sb} 分。宣布哪一隊贏了！`), { host: 'cheer', mood: 'happy' });
  // 10 頒獎
  W.side = { kind: 'gifts' };
  push(L('pencil'), { host: 'clap' });
  push(L('surprise'), { host: 'cheer' });
  push(L('congrats'), { host: 'clap', mood: 'happy' });
  if (chance(.6)) push(L('oval'), { host: 'point' });
  // 11 道別
  push(L('giveback'), { host: 'wave', side: { kind: 'basket' } });
  W.bandsOn = false; W.side = null;
  push(L('thanks'), { host: 'clap', mood: 'happy' });
  if (chance(.75)) push(L('happyhave'), { host: 'wave' });
  push(L('enjoy'), { host: 'wave', mood: 'happy' });
  return steps;
}

function genHelper() {
  const steps = [];
  const size = chance(.5) ? 5 : 4;
  const team = size === 5 ? 'B' : 'A';
  const names = size === 5 ? ANIMALS_B : ANIMALS_A;
  const bands = BAND_CARDS[size];
  let W = { sizeB: 5, only: team, given: 0, bandsOn: false, board: null, side: { kind: 'basket' }, host: null, raise: null, mood: null };
  const push = (st, patch = {}) => { st.sc = clone({ ...W, ...patch }); steps.push(st); };
  push(L('line'), { mood: 'conf' });
  let didEach = false, didEither = false, didLook = false;
  for (let i = 0; i < size; i++) {
    const b = bands[i]; const two = b.length === 2; const nm = ZH_NAME[names[i]];
    W.given = i + 1;
    const focus = { team, i };
    push(D('yournum', '戴手環', 'base',
      `You are number ${numWord(i + 1)}. ${two ? 'These are your colors.' : 'This is your color.'}`,
      `你是 ${i + 1} 號，${two ? '這些是你的顏色' : '這是你的顏色'}。`,
      `輪到${nm}了。他是 ${i + 1} 號，配色卡上是「${colorsZh(b)}」${two ? '兩個' : '一個'}手環。把手環交給他，告訴他號碼和顏色。`), { focus });
    if (two && !didEach) { didEach = true; push(L('eachhand', { sit: `${nm}拿著兩個手環，不知道要怎麼戴。告訴他左右手各戴一個。` }), { focus }); }
    if (!two && !didEither) { didEither = true; push(L('either', { sit: `${nm}只有一個手環，問你要戴哪一手。告訴他哪一手都可以。` }), { focus }); }
    if (i === 2 && !didLook && chance(.8)) {
      didLook = true; const j = rnd(2);
      push(L('lookcard', { sit: `${ZH_NAME[names[j]]}突然忘記自己該戴哪個顏色，一臉困惑。請他看配色卡。` }), { focus: { team, i: j }, react: { [`${team}${j}`]: 'q' } });
    }
  }
  push(L('remember'), { mood: 'happy' });
  if (chance(.7)) {
    const other = team === 'A' ? 'B' : 'A';
    push(L('choose', { sit: `下一隊來了。他們還沒決定誰是幾號，想自己分配顏色。請他們一起討論、決定誰戴哪些顏色。` }), { only: other, given: 0, sizeB: 5, mood: 'conf' });
  }
  return steps;
}

/* =========================================================
   比對
   ========================================================= */
const CONTR = { "let's": 'let us', "it's": 'it is', "that's": 'that is', "time's": 'time is', "we're": 'we are', "you're": 'you are', "i'm": 'i am', "don't": 'do not', "what's": 'what is', "there's": 'there is', "here's": 'here is', "they're": 'they are' };
const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const COLOR_WORDS = { white: 'w', red: 'r', blue: 'b', green: 'g', yellow: 'y', black: 'k', orange: 'o', brown: 'n' };
function norm(t) {
  t = String(t || '').toLowerCase().replace(/[’‘`´]/g, "'");
  t = t.replace(/\b7\s*-?\s*eleven\b|\bseven-eleven\b/g, 'seven eleven');
  t = t.replace(/\bokay\b|\bo\.k\.?/g, 'ok').replace(/colour/g, 'color');
  t = t.replace(/[a-z]+'[a-z]+/g, m => CONTR[m] || m.replace("'", ''));
  t = t.replace(/\blets\b/g, 'let us').replace(/\bits (close|a tie)\b/g, 'it is $1').replace(/\bthats\b/g, 'that is').replace(/\btimes up\b/g, 'time is up').replace(/\bwere happy\b/g, 'we are happy').replace(/\byoure\b/g, 'you are');
  t = t.replace(/\b\d+\b/g, m => NUMS[+m] ?? m);
  t = t.replace(/[^a-z0-9 ]+/g, ' ');
  t = t.replace(/\bteam (be|bee)\b/g, 'team b').replace(/\bteam (eh|hey|ay)\b/g, 'team a');
  t = t.replace(/\b(?:[a-z] ){2,}[a-z]\b/g, m => m.replace(/ /g, ''));
  return t.split(/\s+/).filter(Boolean);
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
const ratio = (a, b) => { const mx = Math.max(a.length, b.length); return mx ? 1 - lev(a, b) / mx : 1; };
function lcsPairs(a, b) {
  const m = a.length, n = b.length; const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ma = new Set(), mb = new Set(); let i = 0, j = 0;
  while (i < m && j < n) { if (a[i] === b[j]) { ma.add(i); mb.add(j); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  return [ma, mb];
}
function tokens(text) {
  const toks = String(text || '').trim().split(/\s+/).filter(Boolean);
  const flat = [], owner = [];
  toks.forEach((t, ti) => norm(t).forEach(w => { flat.push(w); owner.push(ti); }));
  return { toks, flat, owner };
}
function grade(st, text) {
  const user = norm(text);
  if (!user.length) return { grade: 'bad', ratio: 0, target: st.en, missing: [], extra: [] };
  if (st.mode === 'colors') {
    const exp = new Set([...st.colorKeys]);
    const got = new Set(user.filter(w => COLOR_WORDS[w]).map(w => COLOR_WORDS[w]));
    const missing = [...exp].filter(k => !got.has(k)).map(k => COLORS[k].en);
    const extra = [...got].filter(k => !exp.has(k)).map(k => COLORS[k].en);
    const off = missing.length + extra.length;
    const g = off === 0 ? 'ok' : off === 1 && exp.size > 2 ? 'close' : 'bad';
    return { grade: g, ratio: 1 - off / Math.max(exp.size, 1), target: st.en, missing, extra, colorsMode: true };
  }
  // 允許自由發揮：只要台詞的字都有依序說到，前後多說的話不扣分
  let best = { key: -1 };
  for (const t of [st.en, ...(st.alts || [])]) {
    const tw = norm(t);
    let r = ratio(tw, user);
    if (st.mode === 'brand') r = Math.max(r, ratio(tw.join('').split(''), user.join('').split('')));
    const [mt] = lcsPairs(tw, user);
    const cov = tw.length ? mt.size / tw.length : 0;
    const key = Math.max(cov, r) + r * .01;
    if (key > best.key) best = { key, ratio: r, cov, target: t };
  }
  let g = best.cov >= 0.999 ? 'ok' : (best.ratio >= 0.7 || best.cov >= 0.75) ? 'close' : 'bad';
  if (st.mode === 'brand' && best.ratio >= 0.8 && user.slice(0, 2).join(' ') === 'this is') g = 'ok';
  const e = tokens(best.target), u = tokens(text);
  const [me, mu] = lcsPairs(e.flat, u.flat);
  const missing = e.flat.filter((_, i) => !me.has(i));
  const extra = u.flat.filter((_, i) => !mu.has(i));
  return { grade: g, ratio: Math.max(best.ratio, best.cov), target: best.target, missing, extra, words: user.length };
}

/* ---------- 文法檢查（LanguageTool 免費服務，需要網路） ---------- */
const GRAM_CAT = { GRAMMAR: '文法', TYPOS: '拼字', CONFUSED_WORDS: '易混淆字', COLLOCATIONS: '搭配用法', REDUNDANCY: '重複', STYLE: '用語', SEMANTICS: '語意', MISC: '其他' };
const gramCache = {};
async function checkGrammar(text, st) {
  const k = text.trim();
  if (gramCache[k]) return gramCache[k];
  const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000);
  try {
    const body = new URLSearchParams({
      text: k, language: 'en-US',
      disabledCategories: 'CASING,PUNCTUATION,TYPOGRAPHY',
      disabledRules: 'UPPERCASE_SENTENCE_START,PUNCTUATION_PARAGRAPH_END,WHITESPACE_RULE,COMMA_PARENTHESIS_WHITESPACE,EN_QUOTES,DASH_RULE,SENTENCE_FRAGMENT',
    });
    const r = await fetch('https://api.languagetool.org/v2/check', { method: 'POST', body, signal: ctl.signal });
    if (!r.ok) throw new Error('http ' + r.status);
    const data = await r.json();
    // 品牌名、人名不算拼字錯
    const known = new Set(norm([st.en, ...(st.alts || []), ...CARDS.map(c => c.say + ' ' + c.alts.join(' ')), 'ZLCHS Kumamoto Kita Zhong Li Taoyuan Taiwanese'].join(' ')));
    const issues = (data.matches || []).filter(m => {
      const word = k.substr(m.offset, m.length);
      if (m.rule && m.rule.category && m.rule.category.id === 'TYPOS' && norm(word).every(w => known.has(w))) return false;
      return true;
    }).map(m => ({
      off: m.offset, len: m.length, word: k.substr(m.offset, m.length),
      cat: GRAM_CAT[m.rule?.category?.id] || '提醒',
      msg: m.shortMessage || m.message,
      fix: (m.replacements || []).slice(0, 3).map(x => x.value),
    }));
    let fixed = k;
    [...issues].sort((a, b) => b.off - a.off).forEach(i => { if (i.fix[0] != null) fixed = fixed.slice(0, i.off) + '\u0001' + i.fix[0] + '\u0002' + fixed.slice(i.off + i.len); });
    const res = { ok: true, issues, fixed };
    gramCache[k] = res; return res;
  } catch (e) {
    return { ok: false };
  } finally { clearTimeout(tm); }
}
function gramHTML(g) {
  if (!g) return '<span class="muted">文法檢查中⋯</span>';
  if (!g.ok) return '<span class="muted">文法檢查暫時連不上（需要網路），這次先略過。</span>';
  if (!g.issues.length) return '<b class="gram-ok">文法檢查：沒有發現問題</b>';
  const fixed = esc(g.fixed).replace(/\u0001/g, '<span class="mark">').replace(/\u0002/g, '</span>');
  return `<b>文法檢查：有 ${g.issues.length} 個地方可以注意</b>
<ul>${g.issues.map(i => `<li><span class="pill" style="padding:1px 8px;font-size:12px">${esc(i.cat)}</span> <span class="en">「${esc(i.word)}」${i.fix.length ? ` → <b>${i.fix.map(esc).join(' / ')}</b>` : ''}</span><br><span class="muted en" style="font-size:13px">${esc(i.msg)}</span></li>`).join('')}</ul>
<div class="en" style="font-size:15px">修正後：${fixed}</div>`;
}
function runGrammar(idx, text) {
  if (!DB.grammarOn) return;
  const st = S.steps[idx];
  checkGrammar(text, st).then(g => {
    const r = S.res[idx];
    if (r && r.user === text) {
      r.gram = g;
      // 和台詞差很多、但文法正確又說了完整一句 → 算「自由發揮」
      if (g.ok && !g.issues.length && r.grade === 'bad' && (r.words || 0) >= 3 && !r.colorsMode) { r.grade = 'free'; }
    }
    if (S.answered && S.answered.text === text && S.i === idx) {
      S.answered.gram = g;
      if (r && r.grade === 'free' && S.answered.gr.grade === 'bad' && !S.retrying) S.answered.gr.grade = 'free';
      else if (S.retrying && g.ok && !g.issues.length && S.answered.gr.grade === 'bad' && (S.answered.gr.words || 0) >= 3 && !S.answered.gr.colorsMode) S.answered.gr.grade = 'free';
      renderPlay();
    }
  });
}
function diffHTML(st, text, gr) {
  if (gr.colorsMode) {
    const miss = new Set(gr.missing), ext = new Set(gr.extra);
    const exp = st.en.split(/\s+/).map(t => { const w = norm(t)[0]; return miss.has(w) ? `<span class="mark">${esc(t)}</span>` : esc(t); }).join(' ');
    const you = String(text).split(/\s+/).map(t => { const w = norm(t)[0]; return ext.has(w) ? `<span class="del">${esc(t)}</span>` : esc(t); }).join(' ');
    return { exp, you };
  }
  const e = tokens(gr.target), u = tokens(text);
  const [me, mu] = lcsPairs(e.flat, u.flat);
  const badE = new Set(), okU = new Set();
  e.flat.forEach((_, i) => { if (!me.has(i)) badE.add(e.owner[i]); });
  u.flat.forEach((_, i) => { if (mu.has(i)) okU.add(u.owner[i]); });
  const exp = e.toks.map((t, i) => badE.has(i) ? `<span class="mark">${esc(t)}</span>` : esc(t)).join(' ');
  const xc = gr.grade === 'ok' ? 'xtra' : 'diffw';
  const you = u.toks.map((t, i) => okU.has(i) ? esc(t) : `<span class="${xc}">${esc(t)}</span>`).join(' ');
  return { exp, you };
}
const firstLetters = en => en.split(/\s+/).map(w => w.replace(/[A-Za-z0-9]+/g, m => m[0] + '_'.repeat(Math.max(m.length - 1, 0)))).join('  ');

/* =========================================================
   語音
   ========================================================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
let voiceEn = null;
function loadVoice() { try { const vs = speechSynthesis.getVoices(); voiceEn = vs.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google|Jenny|Aria|Ava/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch (e) { /* ignore */ } }
if ('speechSynthesis' in window) { loadVoice(); speechSynthesis.onvoiceschanged = loadVoice; }
function speak(text) {
  if (!('speechSynthesis' in window)) { toast('這個瀏覽器不支援發音播放'); return; }
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = .92; if (voiceEn) u.voice = voiceEn; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
}
function toggleMic() {
  if (!SR || DB.micMode === 'keyboard') { const inp = $('#ans'); if (inp) inp.focus(); return; }
  if (S.listening && rec) { rec.stop(); return; }
  try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
  let finals = [];
  rec.onresult = e => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finals.push([...r].map(a => a.transcript.trim())); else interim += r[0].transcript;
    }
    const shown = finals.map(f => f[0]).join(' ') + (interim ? ' ' + interim : '');
    const inp = $('#ans'); if (inp) inp.value = shown.trim();
    const l = $('#listening'); if (l) l.textContent = '聽到：' + shown.trim();
  };
  rec.onerror = e => {
    S.listening = false; updateMic();
    const code = e.error || 'unknown';
    if (code === 'aborted') return;
    if (code === 'no-speech') { const l = $('#listening'); if (l) l.textContent = '沒有聽到聲音，再按一次試試。'; return; }
    // 其他錯誤：這支手機的網頁語音不能用 → 自動改成鍵盤聽寫模式，之後不再跳提醒
    setKeyboardMode(code);
  };
  rec.onend = () => {
    S.listening = false; updateMic();
    if (finals.length) {
      // 多個候選句裡，挑最接近正確答案的那一個
      const st = S.steps[S.i];
      const combos = finals.length === 1 ? finals[0] : [finals.map(f => f[0]).join(' ')];
      let best = combos[0], br = -1;
      for (const c of combos) { const g = grade(st, c); if (g.ratio > br) { br = g.ratio; best = c; } }
      submit(best);
    }
  };
  try { rec.start(); S.listening = true; updateMic(); } catch (e) { toast('麥克風啟動失敗，請再按一次'); }
}
function setKeyboardMode(code) {
  const first = DB.micMode !== 'keyboard';
  DB.micMode = 'keyboard'; DB.micCode = code; save();
  if (first) toast('已切換成「鍵盤聽寫」模式：之後點輸入框，按鍵盤上的麥克風說英文就好。');
  if (S.steps) { keepInput(); const inp = $('#ans'); if (inp) inp.focus(); }
  else if ($('.start')) renderStart();
}
function micTest() {
  if (!SR) { setKeyboardMode('unsupported'); return; }
  const box = $('#mictest'); if (box) box.innerHTML = '<b>請說：</b><span class="en">Hello, nice to meet you!</span><div class="muted" style="font-size:13px">聆聽中⋯</div>';
  let heard = '';
  try {
    const t = new SR(); t.lang = 'en-US'; t.interimResults = true; t.continuous = false;
    t.onresult = e => { heard = [...e.results].map(r => r[0].transcript).join(' '); if (box) box.querySelector('.muted').textContent = '聽到：' + heard; };
    t.onerror = e => { if (e.error === 'no-speech') { if (box) box.querySelector('.muted').textContent = '沒有聽到聲音，請再測一次。'; return; } if (e.error !== 'aborted') setKeyboardMode(e.error); };
    t.onend = () => { if (heard) { DB.micMode = 'web'; save(); toast('麥克風可以用！'); renderStart(); } };
    t.start();
  } catch (e) { setKeyboardMode('start-failed'); }
}
function updateMic() {
  const m = $('#mic'); if (!m) return;
  m.classList.toggle('on', S.listening);
  m.innerHTML = S.listening ? `${ic('stop')}<span>聆聽中⋯</span>` : `${ic('mic')}<span>按我說話</span>`;
  m.setAttribute('aria-label', S.listening ? '停止聆聽' : '開始說話');
  const l = $('#listening'); if (l && S.listening && !l.textContent) l.textContent = '請說英文⋯';
}

/* =========================================================
   場景
   ========================================================= */
const HOST_POSE = { wave: 'host-wave', point: 'host-point', card: 'host-card', cheer: 'host-cheer', clap: 'host-clap' };
const cardBy = code => CARDS.find(c => c.code === code);
function sceneHTML(sc, mood) {
  mood = mood || sc.mood;
  const teams = [['A', ANIMALS_A, BAND_CARDS[4]], ['B', ANIMALS_B.slice(0, sc.sizeB), BAND_CARDS[sc.sizeB]]];
  let extraUsed = false;
  const teamHTML = teams.map(([T, names, bandArr]) => {
    if (sc.only && sc.only !== T) return '';
    const cells = names.map((k, i) => {
      let bands = '';
      if (sc.bandsOn) bands = bandArr[i];
      else if (sc.only === T && i < (sc.given || 0)) bands = bandArr[i];
      let pose = 'n', rx = '';
      if (sc.raise && bands) {
        const cnt = [...bands].filter(c => sc.raise.colors.includes(c)).length;
        if (cnt >= 2) pose = 'r2'; else if (cnt === 1) pose = 'r1';
        if (sc.raise.extra && !extraUsed && T === 'B' && cnt === 0) { pose = 'r1'; rx = '<span class="rx oops">!!</span>'; extraUsed = true; }
      }
      if (pose === 'n' && mood === 'happy') pose = 'happy';
      if (pose === 'n' && mood === 'conf' && (i + (T === 'B' ? 1 : 0)) % 2 === 0) pose = 'conf';
      const r = sc.react && sc.react[`${T}${i}`];
      if (r === 'q') { pose = 'conf'; rx = '<span class="rx">?</span>'; }
      const focus = sc.focus && sc.focus.team === T && sc.focus.i === i;
      const tag = bands ? `<span class="bands"><b>${i + 1}</b>${[...bands].map(c => `<i style="background:${COLORS[c].hex}"></i>`).join('')}</span>` : '<span class="bands ghost"><b>0</b><i></i></span>';
      return `<div class="ani${focus ? ' focus' : ''}"><div class="pic"><img src="${IMG(k + '-' + pose)}" alt="${ZH_NAME[k]}">${rx}</div>${tag}</div>`;
    }).join('');
    return `<div class="team ${T}"${sc.only ? ' style="left:' + (T === 'A' ? '24cqw' : '22cqw') + ';bottom:1.5cqw;--aw:' + (sc.only ? '13cqw' : '') + '"' : ''}><span class="lbl">Team ${T}</span><div class="row">${cells}</div></div>`;
  }).join('');

  let board = '';
  if (sc.board) {
    const face = sc.board === 'idle'
      ? '<div class="face idle"><span class="en">BRAND</span><span class="en">COLOR</span><span class="en">CHALLENGE</span></div>'
      : `<div class="face">${[...sc.board].map(c => `<i style="background:${COLORS[c].hex}"></i>`).join('')}</div>`;
    board = `<div class="board"><img src="${IMG('prop-easel')}" alt="彩色觀察板">${face}</div>`;
  }
  let side = '';
  const s = sc.side;
  if (s) {
    if (s.kind === 'card') {
      const c = cardBy(s.card);
      const face = s.reveal
        ? `<div class="face">${[...c.colors].map(k => `<i style="background:${COLORS[k].hex}"></i>`).join('')}</div><span class="nm">${esc(c.zh)}<br><span class="en">${esc(c.say)}</span></span>`
        : '<div class="face bw"><i></i><i></i></div>';
      side = `<div class="qcard"><img src="${IMG('prop-card')}" alt="題卡">${face}<span class="code">${c.code}</span></div><span class="tag en">${c.colors.length} colors</span>`;
    } else if (s.kind === 'hourglass') side = `<img src="${IMG('prop-hourglass')}" alt="沙漏" style="width:50%">`;
    else if (s.kind === 'basket') side = `<img src="${IMG('prop-basket')}" alt="手環籃" style="width:62%">`;
    else if (s.kind === 'gifts') side = `<div class="duo"><img src="${IMG('prop-pencil')}" alt="筆袋"><img src="${IMG('prop-gift')}" alt="禮物"></div>`;
    else if (s.kind === 'scoreboard') side = `<div style="position:relative;width:100%"><img src="${IMG('prop-scoreboard')}" alt="計分板"><div class="sbnums"><div><small>Team A</small>${sc.score ? sc.score.A : 0}</div><div><small>Team B</small>${sc.score ? sc.score.B : 0}</div></div></div>`;
    side = `<div class="side">${side}</div>`;
  }
  const host = sc.host ? `<div class="host"><img src="${IMG(HOST_POSE[sc.host])}" alt="關主"></div>` : '';
  const score = sc.score && !(s && s.kind === 'scoreboard') ? `<span class="score">A ${sc.score.A} : ${sc.score.B} B</span>` : '';
  return `<div class="scene${mood === 'happy' && S.answered ? ' hap' : ''}">
<img class="bg" src="${IMG('bg-wide')}" alt="" aria-hidden="true"><div class="fog"></div>
<div class="sign"><span>品牌色彩挑戰 <span class="en">BRAND COLOR CHALLENGE</span></span></div>
${score}${board}${side}${host}${teamHTML}</div>`;
}

/* =========================================================
   流程
   ========================================================= */
let S = { role: 'host', listening: false };
let ROLE = 'host';
const ITEM_SCORE = { ok: 1, close: .7, free: .6, bad: .25, skip: 0 };
function itemScore(r) {
  let s = ITEM_SCORE[r.grade] ?? 0;
  if (r.hints >= 1) s -= .15;
  if (r.hints >= 2) s -= .15;
  if (r.revealed) s = Math.min(s, .3);
  return Math.max(0, s);
}
function heartsNow() {
  const done = S.res.filter(Boolean);
  if (!done.length) return 10;
  return Math.round(10 * done.reduce((a, r) => a + itemScore(r), 0) / done.length);
}

function startRun(mode) {
  const gen = ROLE === 'host' ? genHost : genHelper;
  let steps = gen();
  if (mode === 'quick') {
    const idx = shuffle(steps.map((_, i) => i)).slice(0, 10).sort((a, b) => a - b);
    steps = idx.map(i => steps[i]);
  } else if (mode === 'weak') {
    const weak = weakKeys();
    const chosen = []; const seen = new Set();
    for (const st of steps) if (weak.includes(st.key) && !seen.has(st.key)) { seen.add(st.key); chosen.push(st); }
    if (chosen.length < 6) for (const st of shuffle(steps)) { if (chosen.length >= 8) break; if (!chosen.includes(st)) chosen.push(st); }
    steps = steps.filter(st => chosen.includes(st)).slice(0, 12);
  }
  const blocked = S.srBlocked;
  S = { srBlocked: blocked, role: ROLE, mode, steps, i: 0, res: [], t0: Date.now(), combo: 0, maxCombo: 0, hint: 0, revealed: false, answered: null, listening: false };
  renderPlay();
}
function weakKeys() {
  const list = Object.entries(DB.stats).filter(([k]) => k.startsWith(ROLE + ':')).map(([k, v]) => {
    const badness = (1 - v.ok / v.n) + .5 * (v.hint / v.n);
    return [k.split(':')[1], badness];
  }).filter(([, b]) => b > 0).sort((a, b) => b[1] - a[1]);
  return list.slice(0, 10).map(([k]) => k);
}
const hasStats = () => Object.keys(DB.stats).some(k => k.startsWith(ROLE + ':'));

function submit(text) {
  if (S.answered) return;
  text = String(text || '').trim();
  if (!text) { toast('先說或打一句英文喔'); return; }
  const st = S.steps[S.i];
  const gr = grade(st, text);
  S.res[S.i] = { key: st.key, sec: st.sec, type: st.type, en: st.en, zh: st.zh, user: text, grade: gr.grade, ratio: gr.ratio, missing: gr.missing, extra: gr.extra, hints: Math.min(S.hint, 2), revealed: S.revealed, target: gr.target, colorsMode: !!gr.colorsMode, mode: st.mode, colorKeys: st.colorKeys, words: gr.words };
  const clean = gr.grade === 'ok' && !S.hint && !S.revealed;
  S.combo = clean ? S.combo + 1 : 0; S.maxCombo = Math.max(S.maxCombo, S.combo);
  const sk = `${S.role}:${st.key}`; const v = DB.stats[sk] || { n: 0, ok: 0, hint: 0 };
  v.n++; if (clean) v.ok++; if (S.hint || S.revealed) v.hint++; DB.stats[sk] = v; save();
  S.answered = { text, gr };
  renderPlay();
  runGrammar(S.i, text);
  if (DB.autoSpeak) setTimeout(() => speak(st.en), 250);
}
function retry() {
  S.answered = null; renderPlay(); const i = $('#ans'); if (i) { i.value = ''; }
}
function next() {
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  S.listening = false;
  if (S.i >= S.steps.length - 1) { finish(); return; }
  S.i++; S.hint = 0; S.revealed = false; S.answered = null; renderPlay();
}
function skip() {
  const st = S.steps[S.i];
  S.res[S.i] = { key: st.key, sec: st.sec, type: st.type, en: st.en, zh: st.zh, user: '', grade: 'skip', ratio: 0, missing: [], extra: [], hints: S.hint, revealed: S.revealed, target: st.en };
  S.combo = 0; next();
}

function renderPlay() {
  const st = S.steps[S.i];
  const total = S.steps.length;
  const roleLabel = S.role === 'host' ? '關主模式' : '小幫手模式';
  const modeLabel = { full: '完整一關', quick: '快速抽考', weak: '弱點加強' }[S.mode];
  const mood = S.answered ? (S.answered.gr.grade === 'ok' ? 'happy' : S.answered.gr.grade === 'bad' ? 'conf' : null) : null;
  const top = `<div class="topbar">
<div class="l"><button class="iconbtn" id="home" aria-label="結束練習">${ic('home')}</button><h2>關主模擬器</h2><span class="pill" style="background:${S.role === 'host' ? 'var(--pink)' : 'var(--sky)'}">${roleLabel}</span><span class="pill modepill">${modeLabel}</span></div>
<div class="r"><div class="prog"><b style="color:var(--ink)">${S.i + 1} / ${total}</b><div class="bar"><i style="width:${(S.i / total) * 100}%"></i></div></div>${heartsHTML(heartsNow())}${S.combo >= 2 ? `<span class="combo${S.answered && S.combo >= 2 ? ' pop' : ''}">COMBO ×${S.combo}</span>` : ''}
<button class="iconbtn" id="spk" aria-label="${DB.autoSpeak ? '關閉自動發音' : '開啟自動發音'}" title="答完自動念正確句子">${ic(DB.autoSpeak ? 'sound' : 'mute')}</button></div></div>`;
  const sit = `<div class="card sit"><div class="head"><span class="pill" style="background:var(--mint)">${esc(st.sec)}</span><span class="pill ${st.type === 'base' ? 'tagbase' : 'tagext'}">${st.type === 'base' ? '基本句' : '延伸句'}</span></div><p>${esc(st.sit)}</p></div>`;
  let panel;
  if (!S.answered) {
    const hintTxt = S.revealed ? `<span class="en" style="font-size:17px;font-weight:600">${esc(st.en)}</span>`
      : S.hint >= 2 ? `<div>${esc(st.zh)}</div><div class="en">${esc(firstLetters(st.en))}</div>`
        : S.hint >= 1 ? esc(st.zh) : '';
    panel = `${sit}
<div class="card answer">
<span style="font-weight:700">你要說什麼？</span>
<div class="row">
${DB.micMode === 'keyboard' || !SR ? '<div class="kbtip">點輸入框，按<b>鍵盤上的麥克風</b>說英文，說完按送出。</div>' : `<button class="mic${S.listening ? ' on' : ''}" id="mic" aria-label="開始說話">${ic('mic')}<span>按我說話</span></button>`}
<form class="typebox" id="form" autocomplete="off"><label for="ans" class="sr">輸入英文</label><input id="ans" placeholder="或輸入英文⋯" enterkeyhint="send" autocapitalize="sentences" spellcheck="false"><button class="btn mint" type="submit" aria-label="送出">${ic('send')}</button></form>
</div>
<div class="listening" id="listening"></div>
<div class="hintrow">
<button class="btn${S.hint >= 1 ? ' used' : ''}" id="h1" ${S.hint >= 1 || S.revealed ? 'disabled' : ''}>${ic('bulb')}中文</button>
<button class="btn butter${S.hint >= 2 ? ' used' : ''}" id="h2" ${S.hint >= 2 || S.revealed ? 'disabled' : ''}>${ic('bulb')}首字母</button>
<button class="btn${S.revealed ? ' used' : ''}" id="h3" ${S.revealed ? 'disabled' : ''}>${ic('eye')}看答案</button>
<button class="btn" id="skip" aria-label="跳過這題" style="flex:none;width:48px">${ic('skip')}</button>
</div>
${hintTxt ? `<div class="hintbox">${hintTxt}</div>` : ''}

</div>`;
  } else {
    const { text, gr } = S.answered;
    const d = diffHTML(st, text, gr);
    const cls = { ok: 'ok', close: 'close', free: 'free', bad: 'bad' }[gr.grade];
    const hasExtra = !gr.colorsMode && gr.extra && gr.extra.length;
    const verdict = { ok: hasExtra ? '完全正確！還加了自己的話' : '完全正確！', close: '意思對了，和台詞有小地方不同', free: '自由發揮！文法沒問題', bad: '和台詞差比較多，參考看看' }[gr.grade];
    const usedHint = S.hint || S.revealed;
    const mark = gr.grade === 'ok' ? (usedHint ? '（有用提示）' : '+1 好感') : '';
    panel = `${sit}
<div class="card fb ${cls}">
<div class="verdict"><b>${verdict}<span class="muted" style="font-weight:400;font-size:13px"> ${mark}</span></b><button class="btn" id="say" style="min-height:38px;padding:0 12px;box-shadow:none">${ic('sound')}聽發音</button></div>
<div class="muted" style="font-size:12px;font-weight:700">建議台詞</div><div class="correct" style="margin-top:-6px">${d.exp}</div>
<div class="muted" style="font-size:14px">${esc(st.zh)}</div>
${gr.grade !== 'ok' || hasExtra ? `<div class="yours">你說：${d.you}${gr.grade === 'ok' && hasExtra ? '<br><span style="font-size:12px">綠底是你自己多說的部分，不扣分</span>' : (!gr.colorsMode && gr.extra && gr.extra.length ? '<br><span style="font-size:12px">波浪線是和台詞不一樣的地方</span>' : '')}</div>` : ''}
${gr.grade === 'free' ? '<div class="muted" style="font-size:13px">系統只能檢查文法，沒辦法判斷意思。請對照上面的建議台詞，確認意思一樣喔。</div>' : ''}
${DB.grammarOn && !gr.colorsMode ? `<div class="gram">${gramHTML(S.answered.gram)}</div>` : ''}
${st.fact ? `<div class="fact"><b>Fun Fact</b>　<span class="en">${esc(st.fact)}</span></div>` : ''}
<div class="acts">${gr.grade !== 'ok' ? `<button class="btn" id="again">${ic('repeat')}再說一次</button>` : ''}<button class="btn pink" id="next">${S.i >= S.steps.length - 1 ? '看總結報告' : '下一題'}${ic('next')}</button></div>
</div>`;
  }
  app.innerHTML = `${top}<div class="playgrid">${sceneHTML(st.sc, mood)}<div class="panel">${panel}</div></div><div class="footer">© 2026 啾啾菇</div>`;

  $('#home').onclick = () => { if (S.res.filter(Boolean).length >= 3 && confirm('要結束這一輪並看總結報告嗎？')) finish(); else if (!S.res.filter(Boolean).length || confirm('要回到首頁嗎？這一輪的紀錄不會保存。')) renderStart(); };
  $('#spk').onclick = () => { DB.autoSpeak = !DB.autoSpeak; save(); toast(DB.autoSpeak ? '答完會自動念出正確句子' : '已關閉自動發音'); renderPlay(); };
  if (!S.answered) {
    if ($('#mic')) $('#mic').onclick = toggleMic;
    $('#form').onsubmit = e => { e.preventDefault(); submit($('#ans').value); };
    $('#h1').onclick = () => { S.hint = Math.max(S.hint, 1); keepInput(); };
    $('#h2').onclick = () => { S.hint = 2; keepInput(); };
    $('#h3').onclick = () => { S.revealed = true; keepInput(); speak(st.en); };
    $('#skip').onclick = skip;
    updateMic();
  } else {
    $('#say').onclick = () => speak(st.en);
    $('#next').onclick = next;
    const a = $('#again'); if (a) a.onclick = retryPractice;
    $('#next').focus({ preventScroll: true });
  }
}
function keepInput() { const v = $('#ans') ? $('#ans').value : ''; renderPlay(); if ($('#ans')) $('#ans').value = v; }
// 再說一次：成績以第一次為準，這裡只是讓你再練一次
function retryPractice() { S.answered = null; S.retrying = true; renderPlay(); }
const _submit = submit;
submit = function (text) {
  if (S.retrying && !S.answered) {
    const st = S.steps[S.i]; const gr = grade(st, String(text || '').trim());
    if (!String(text || '').trim()) { toast('先說或打一句英文喔'); return; }
    S.answered = { text: String(text).trim(), gr }; S.retrying = gr.grade !== 'ok';
    renderPlay(); retryGrammar(S.answered.text); if (DB.autoSpeak) setTimeout(() => speak(st.en), 250); return;
  }
  S.retrying = false; _submit(text);
};
function retryGrammar(text) {
  if (!DB.grammarOn) return;
  const idx = S.i; const st = S.steps[idx];
  checkGrammar(text, st).then(g => {
    if (!(S.answered && S.answered.text === text && S.i === idx)) return;
    S.answered.gram = g;
    if (g.ok && !g.issues.length && S.answered.gr.grade === 'bad' && (S.answered.gr.words || 0) >= 3 && !S.answered.gr.colorsMode) S.answered.gr.grade = 'free';
    renderPlay();
  });
}
const _next = next;
next = function () { S.retrying = false; _next(); };

/* =========================================================
   總結報告
   ========================================================= */
const CHEERS = [
  [9, '太厲害了！12/17 你一定沒問題！'],
  [7, '好棒！再順一次就更穩了～'],
  [5, '有進步喔！把標黃色的字再念幾次吧！'],
  [0, '慢慢來，先用提示多練幾次就會熟！'],
];
function finish() {
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  const res = S.res.filter(Boolean);
  if (!res.length) { renderStart(); return; }
  const hearts = heartsNow();
  const okN = res.filter(r => r.grade === 'ok' || r.grade === 'close').length;
  const acc = Math.round(100 * okN / res.length);
  const hintN = res.filter(r => r.grade !== 'skip' && (r.hints || r.revealed)).length;
  const skipN = res.filter(r => r.grade === 'skip').length;
  const secs = Math.round((Date.now() - S.t0) / 1000);
  const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  // 小錯誤分析
  const cnt = {}; const add = (k, n = 1) => { cnt[k] = (cnt[k] || 0) + n; };
  const missW = {};
  for (const r of res) {
    if (r.grade === 'ok' || r.grade === 'skip') continue;
    if (r.colorsMode) { if (r.missing.length || r.extra.length) add('顏色念錯或漏掉'); continue; }
    const miss = r.missing || [], ext = r.extra || [];
    miss.forEach(w => { if (['the', 'a', 'an'].includes(w)) add('漏掉 the／a'); else if (w === 'please') add('少了 Please'); else missW[w] = (missW[w] || 0) + 1; });
    ext.forEach(w => { if (['the', 'a', 'an'].includes(w)) add('多了 the／a'); });
    miss.forEach(w => { if (ext.includes(w.replace(/s$/, '')) || ext.includes(w + 's')) add('單複數（加不加 s）'); });
    if (miss.some(w => NUMS.includes(w))) add('數字念錯');
  }
  Object.entries(missW).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([w, n]) => { if (n >= 1) add(`常漏：${w}`, n); });
  const chips = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);
  // 最弱段落
  const secAgg = {};
  res.forEach(r => { const a = secAgg[r.sec] || (secAgg[r.sec] = { s: 0, n: 0 }); a.s += itemScore(r); a.n++; });
  const weakSec = Object.entries(secAgg).filter(([, a]) => a.n >= 2).map(([k, a]) => [k, a.s / a.n]).sort((a, b) => a[1] - b[1])[0];
  // 需要注意的句子
  const gramList = res.filter(r => r.gram && r.gram.ok && r.gram.issues.length).slice(0, 6);
  const mist = res.filter(r => r.grade !== 'ok' || r.hints || r.revealed).sort((a, b) => itemScore(a) - itemScore(b)).slice(0, 8);
  // 紀錄
  const hist = DB.history[S.role] || (DB.history[S.role] = []);
  hist.push({ t: Date.now(), mode: S.mode, hearts, acc, n: res.length });
  if (hist.length > 30) hist.splice(0, hist.length - 30);
  // 貼紙
  let newSticker = null;
  if (hearts >= 6 && res.length >= 8) {
    const left = ALL_ANIMALS.filter(a => !DB.stickers.includes(a));
    if (left.length) { newSticker = pick(left); DB.stickers.push(newSticker); }
  }
  save();
  const cheer = CHEERS.find(([min]) => hearts >= min)[1];
  const cheerAni = pick(ALL_ANIMALS);
  let tip;
  if (hearts >= 9 && !hintN) tip = '幾乎完美！下次試試不看情境提示、直接說出口的速度。';
  else if (weakSec && weakSec[1] < .8) tip = `「${weakSec[0]}」這段最需要加強，可以用「弱點加強」再練一輪。`;
  else if (skipN >= 3) tip = `這輪跳過了 ${skipN} 題，下次試著用「中文」提示先說說看，比直接跳過更有幫助。`;
  else if (hintN) tip = `這輪用了 ${hintN} 次提示，下次試著先自己說說看再看提示。`;
  else tip = '整體很穩！多練幾輪讓句子變成反射動作。';
  const last = hist.slice(-8);
  const modeLabel = { full: '完整一關', quick: '快速抽考', weak: '弱點加強' }[S.mode];
  app.innerHTML = `<div class="report">
<div class="head"><h1>關主手帳</h1><span class="pill" style="background:var(--butter)">${S.role === 'host' ? '關主' : '小幫手'}・${modeLabel}・第 ${hist.length} 次</span></div>
<div class="card" style="background:rgba(255,247,249,.85);display:flex;flex-direction:column;gap:12px">
<div style="display:flex;align-items:center;gap:12px"><img src="${IMG(cheerAni + '-happy')}" alt="" style="width:62px"><div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:16px">好感度 ${hearts} / 10</b>${heartsHTML(hearts)}${S.maxCombo >= 3 ? `<span class="muted" style="font-size:13px">最高連擊 COMBO ×${S.maxCombo}</span>` : ''}</div></div>
<div class="stats"><div class="stat"><b>${acc}%</b><small>正確率</small></div><div class="stat"><b>${hintN}</b><small>用提示</small></div><div class="stat"><b>${time}</b><small>花費時間</small></div><div class="stat"><b>${skipN ? skipN : res.length}</b><small>${skipN ? '跳過' : '題數'}</small></div></div>
</div>
${newSticker ? `<div class="newsticker"><img src="${IMG(newSticker + '-happy')}" alt=""><div><b>獲得新貼紙：${ZH_NAME[newSticker]}！</b><div class="muted" style="font-size:13px">已收集 ${DB.stickers.length} / 9</div></div></div>` : ''}
<h3>需要注意的句子</h3>
${mist.length ? mist.map(r => {
    const d = r.grade === 'skip' ? { exp: esc(r.en), you: '（跳過）' } : diffHTML({ en: r.en }, r.user, { colorsMode: r.colorsMode, missing: r.missing, extra: r.extra, target: r.target || r.en });
    const why = r.grade === 'skip' ? '跳過' : r.grade === 'free' ? '自由發揮（請對照台詞）' : r.revealed ? '看了答案' : r.hints ? `用了提示 ${r.hints}` : r.grade === 'close' ? '小地方不同' : '需要再練';
    return `<div class="mis"><small><span>${esc(r.sec)}</span><span>${why}</span></small>${r.grade === 'ok' ? '' : `<span class="y">你說：${d.you}</span>`}<span class="c">${d.exp}</span><span class="muted" style="font-size:12px">${esc(r.zh)}</span></div>`;
  }).join('') : '<div class="mis"><span>這輪沒有需要注意的句子，全部一次就說對了！</span></div>'}
${gramList.length ? `<h3>文法提醒</h3>${gramList.map(r => `<div class="mis"><span class="y">你說：${esc(r.user)}</span>${r.gram.issues.map(i => `<span style="font-size:14px"><span class="pill" style="padding:1px 8px;font-size:12px">${esc(i.cat)}</span> <span class="en">「${esc(i.word)}」${i.fix.length ? ` → <b>${i.fix.map(esc).join(' / ')}</b>` : ''}</span></span>`).join('')}</div>`).join('')}` : ''}
${chips.length ? `<h3>常犯小錯</h3><div class="chips">${chips.map(([k, n]) => `<span class="pill">${esc(k)} ×${n}</span>`).join('')}</div>` : ''}
<div class="card" style="display:flex;flex-direction:column;gap:6px"><b>下次建議</b><span style="font-size:15px;line-height:1.6">${esc(tip)}</span></div>
<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap">
<div><b style="font-size:14px">近 ${last.length} 次好感度</b><div class="chart" role="img" aria-label="近幾次好感度">${last.map((h, i) => `<div><span style="height:${Math.max(6, h.hearts * 7)}px"></span>${h.hearts}</div>`).join('')}</div></div>
<div class="cheer"><img src="${IMG(cheerAni + '-n')}" alt="${ZH_NAME[cheerAni]}"><p>${esc(cheer)}</p></div>
</div>
<div style="display:flex;gap:8px">
<button class="btn pink" id="again" style="flex:1">${ic('repeat')}再玩一次</button>
<button class="btn mint" id="weak" style="flex:1">${ic('target')}練弱點</button>
<button class="btn" id="home" aria-label="回首頁">${ic('home')}</button>
</div>
<div class="footer">© 2026 啾啾菇</div>
</div>`;
  window.scrollTo(0, 0);
  const mode = S.mode;
  $('#again').onclick = () => startRun(mode);
  $('#weak').onclick = () => startRun('weak');
  $('#home').onclick = renderStart;
}

/* =========================================================
   首頁
   ========================================================= */
function renderStart() {
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  S = { role: ROLE, listening: false };
  const hist = DB.history[ROLE] || [];
  const lastH = hist.length ? hist[hist.length - 1] : null;
  const fullN = ROLE === 'host' ? '約 60 句，從開場到道別（15–20 分鐘）' : '約 10 句，發手環到處理小狀況';
  app.innerHTML = `<div class="start">
<div class="hero"><span class="en muted" style="font-size:13px;letter-spacing:1px;font-weight:600">BRAND COLOR CHALLENGE</span><h1>關主模擬器</h1><span class="muted" style="font-size:14px">熊本北小動物訪問團來囉！12/17</span></div>
<div class="crew">${['shiba-r2', 'cat-happy', 'rabbit-r2', 'fox-happy', 'penguin-happy'].map(n => `<img src="${IMG(n)}" alt="">`).join('')}</div>
<b>選擇你的角色</b>
<div class="roles">
<button class="role" data-role="host" aria-pressed="${ROLE === 'host'}"><img src="${IMG('host-wave')}" alt=""><b>關主</b><small>主持整關：開場、規則、<br>出題、計分、頒獎</small></button>
<button class="role helper" data-role="helper" aria-pressed="${ROLE === 'helper'}"><img src="${IMG('prop-basket')}" alt="" style="height:70px;margin:11px 0"><b>小幫手</b><small>發手環、帶隊排隊、<br>處理手環小狀況</small></button>
</div>
<div class="card" style="display:flex;flex-direction:column;gap:8px;padding:14px 16px">
<b>麥克風測試</b>
<div id="mictest" style="font-size:14px;line-height:1.6">${DB.micMode === 'web' ? '<span class="gram-ok"><b>麥克風可以用</b></span>，遊戲中按粉紅色麥克風說話。' : DB.micMode === 'keyboard' ? '這支手機的網頁語音不能用，已切換成<b>鍵盤聽寫</b>模式：作答時點輸入框，按鍵盤上的麥克風說英文。' : '開始前先測一次，確認網頁能不能直接聽你說話。'}</div>
<div style="display:flex;gap:8px"><button class="btn" id="mt" style="flex:1">${ic('mic')}${DB.micMode ? '重新測試' : '開始測試'}</button>${DB.micMode !== 'keyboard' ? '<button class="btn" id="kb" style="flex:1">直接用鍵盤聽寫</button>' : ''}</div>
<span class="muted" style="font-size:12px">可以照台詞說，也可以自由多說一點：台詞的內容有說到，多加的話不扣分。</span>
</div>
<b>練習模式</b>
<div class="modes">
<button class="btn mode" data-mode="full">${ic('star')}<span>完整一關<small>${fullN}</small></span></button>
<button class="btn mode" data-mode="quick">${ic('clock')}<span>快速抽考<small>隨機 10 題，零碎時間用</small></span></button>
<button class="btn mode" data-mode="weak" ${hasStats() ? '' : 'disabled'}>${ic('target')}<span>弱點加強<small>${hasStats() ? '只練常錯和看過提示的句子' : '先玩一輪，才知道你的弱點喔'}</small></span></button>
</div>
<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:14px">貼紙收集 ${DB.stickers.length} / 9</b><div class="stickers">${ALL_ANIMALS.map(a => `<div class="sticker${DB.stickers.includes(a) ? '' : ' off'}" title="${ZH_NAME[a]}"><img src="${IMG(a + '-n')}" alt="${DB.stickers.includes(a) ? ZH_NAME[a] : '未收集'}"></div>`).join('')}</div><span class="muted" style="font-size:12px">一輪 8 題以上、好感度 6 顆心以上，就能抽一張新貼紙。</span></div>
${lastH ? `<div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px"><span style="font-size:14px">上次（${ROLE === 'host' ? '關主' : '小幫手'}）</span>${heartsHTML(lastH.hearts)}<span class="en" style="font-weight:700">${lastH.acc}%</span></div>` : ''}
<label style="display:flex;align-items:center;gap:8px;font-size:14px"><input type="checkbox" id="gramOn" ${DB.grammarOn ? 'checked' : ''} style="width:20px;height:20px">答完幫我檢查文法（需要網路，會把句子送到 LanguageTool 免費服務檢查）</label>

<div style="display:flex;justify-content:space-between;align-items:center"><button class="linkbtn" id="clear">清除練習紀錄</button><span class="muted" style="font-size:12px">© 2026 啾啾菇</span></div>
</div>`;
  document.querySelectorAll('.role').forEach(b => b.onclick = () => { ROLE = b.dataset.role; renderStart(); });
  document.querySelectorAll('.mode').forEach(b => b.onclick = () => startRun(b.dataset.mode));
  $('#mt').onclick = micTest;
  if ($('#kb')) $('#kb').onclick = () => setKeyboardMode('manual');
  $('#gramOn').onchange = e => { DB.grammarOn = e.target.checked; save(); };
  $('#clear').onclick = () => { if (confirm('確定要清除所有練習紀錄和貼紙嗎？')) { DB = { history: { host: [], helper: [] }, stats: {}, stickers: [], autoSpeak: DB.autoSpeak, grammarOn: DB.grammarOn }; save(); renderStart(); toast('紀錄已清除'); } };
  window.scrollTo(0, 0);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && S.answered && document.activeElement && document.activeElement.id !== 'say') {
    if (document.activeElement.id === 'next') return; // 按鈕本身會處理
    e.preventDefault(); next();
  }
});
renderStart();
