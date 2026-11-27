'use strict';
/* =========================================================
   關主英文助手 V5｜首頁、快速複習、弱點加強、完整話術庫、
   現場小抄、練習紀錄、貼紙、設定、AI 陪練
   沿用 app.js 的資料庫（DB）、朗讀（speak）、圖示（ic）與情境模擬
   © 2026 啾啾菇
   ========================================================= */
const APP_VERSION = '5.2.0';
const SECS = CHEAT_TABS.map(t => t.name);
const SEC_SHORT = s => s.replace(/^\d+\s*/, '');
const LEVEL_ZH = { bad: '說不出來', shaky: '有點卡', good: '很順利' };
const STATUS_ZH = { new: '新增', modified: '修改', retained: '保留' };

/* ---------- 資料遷移（不清除舊紀錄） ---------- */
(function migrate() {
  const v = DB.schemaVersion || 1;
  if (v < 5) {
    try { localStorage.setItem(KEY + '-backup-before-v5', JSON.stringify(DB)); } catch (e) { /* ignore */ }
    DB.cards = DB.cards || {};
    for (const [k, c] of Object.entries(DB.cards)) {
      if (c.level === undefined) c.level = c.bad ? 'bad' : (c.streak > 0 ? 'good' : null);
      c.n = c.n || 0; c.streak = c.streak || 0; c.badN = c.badN || (c.bad ? 1 : 0);
      const d = LINES[k] || DYN_CHEAT[k];
      if (d && d.status === 'modified' && c.level === 'good') c.changed = true; // 內容有更新，建議重新複習
    }
    DB.grammarOn = false; // V5 起文法檢查預設關閉
  }
  DB.history = DB.history || { host: [], helper: [] };
  DB.stats = DB.stats || {}; DB.cards = DB.cards || {}; DB.stickers = DB.stickers || [];
  DB.fav = DB.fav || []; DB.weakManual = DB.weakManual || []; DB.custom = DB.custom || []; DB.cardLog = DB.cardLog || [];
  DB.role = DB.role || 'host';
  DB.review = Object.assign({ count: 10, type: 'base', role: 'auto', sec: '', status: 'all', mastery: 'all', fav: false, order: 'random' }, DB.review || {});
  DB.liveCfg = Object.assign({ size: 9, zh: true, font: 'l', wake: true, scoreMode: 'paper', read: 'full', mode: 'quick' }, DB.liveCfg || {});
  DB.quickState = Object.assign({ sec: '01 開場', nc: null, round: 1, result: null, tw: null }, DB.quickState || {});
  if (DB.dataRev !== '5.2') { // V5.2 修改內容的句子：標記建議重新複習，不刪任何紀錄
    for (const [k, d] of Object.entries(LINES)) if (d.rev52 && DB.cards[k] && DB.cards[k].level === 'good') DB.cards[k].changed = true;
    DB.dataRev = '5.2';
  }
  delete DB.liveCfg.role; // V5.1：現場角色跟首頁同一個設定
  DB.speechRate = DB.speechRate || .92;
  if (DB.autoSpeak === undefined) DB.autoSpeak = true;
  DB.schemaVersion = 5;
  save();
})();
ROLE = DB.role;
cheatEntry = k => LINES[k] || DYN_CHEAT[k] || DB.custom.find(c => c.key === k);
const allKeys = () => [...CHEAT_TABS.flatMap(t => t.keys), ...DB.custom.map(c => c.key)];
const secOf = k => { const d = cheatEntry(k); return d ? d.sec : ''; };
const levelOf = k => (DB.cards[k] && DB.cards[k].level) || null;
const isFav = k => DB.fav.includes(k);
const isLive = k => !(LINES[k] && LINES[k].practice) && (Object.values(LIVE_CORE).some(a => a.includes(k)) || Object.values(LIVE_CORE_HELPER).some(a => a.includes(k)) || LIVE_TIE.includes(k) || (k.startsWith('round') && DYN_CHEAT[k]));
function toggleFav(k) { const i = DB.fav.indexOf(k); if (i >= 0) DB.fav.splice(i, 1); else DB.fav.push(k); save(); return i < 0; }
function addWeak(k) { if (!DB.weakManual.includes(k)) { DB.weakManual.push(k); save(); toast('已加入待加強'); } else toast('已經在待加強清單裡'); }
const roleOk = (k, role) => { const d = cheatEntry(k); if (!d) return false; return role === 'all' || (d.role || 'host') === role; };

// speak() 套用朗讀速度
const _speak = speak;
speak = function (text) {
  if (!('speechSynthesis' in window)) { toast('這個瀏覽器不支援發音播放'); return; }
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = DB.speechRate || .92; if (voiceEn) u.voice = voiceEn; speechSynthesis.speak(u); } catch (e) { _speak(text); }
};

/* ---------- 英文數字與句型工具 ---------- */
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function nw(n) { n = Math.max(0, Math.floor(n)); if (n < 20) return ONES[n]; if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); return String(n); }
const plural = (n, w) => `${nw(n)} ${w}${n === 1 ? '' : 's'}`;
const listColors = keys => { const w = [...keys].map(k => COLORS[k].en); return w.length === 1 ? w[0] : w.length === 2 ? w.join(' and ') : w.slice(0, -1).join(', ') + ', and ' + w[w.length - 1]; };
const listColorsZh = keys => [...keys].map(k => COLORS[k].zh + '色').join('、');

/* =========================================================
   首頁
   ========================================================= */
function weakKeysAll(role) {
  const r = role || DB.role;
  const set = new Set();
  for (const [k, c] of Object.entries(DB.cards)) if ((c.level === 'bad' || c.level === 'shaky') && cheatEntry(k) && roleOk(k, r)) set.add(k);
  for (const k of DB.weakManual) if (cheatEntry(k) && roleOk(k, r)) set.add(k);
  for (const [sk, v] of Object.entries(DB.stats)) { const [rl, k] = sk.split(':'); if ((rl === r || r === 'all') && cheatEntry(k) && (v.ok < v.n || v.hint > 0)) set.add(k); }
  return [...set];
}
renderStart = function () {
  CARD = null; window.__rerender = renderStart; releaseWake();
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  const weakN = weakKeysAll().length;
  const live = DB.liveState && DB.liveState.started;
  app.innerHTML = `<div class="home">
<div class="home-hero"><div><span class="en muted" style="font-size:12px;letter-spacing:1px;font-weight:600">BRAND COLOR CHALLENGE</span><h1>關主英文助手</h1><span class="muted" style="font-size:13px">熊本北高中來訪 12/17</span></div>
<div class="home-crew">${['shiba-happy', 'rabbit-r2', 'penguin-happy'].map(n => `<img src="${IMG(n)}" alt="">`).join('')}</div></div>
<div class="seg" role="group" aria-label="角色"><button class="${DB.role === 'host' ? 'on' : ''}" data-role="host">關主</button><button class="${DB.role === 'helper' ? 'on' : ''}" data-role="helper">小幫手</button></div>
<div class="home-grid">
<button class="hcard pinkc" id="goReview">${ic('cards')}<b>快速複習</b><small>看情境、說英文、翻卡</small></button>
<button class="hcard mintc" id="goWeak">${ic('target')}<b>弱點加強${weakN ? `<span class="badge">${weakN}</span>` : ''}</b><small>集中練不熟的話術</small></button>
<button class="hcard butterc" id="goLib">${ic('book')}<b>完整話術庫</b><small>分類、搜尋、朗讀、收藏</small></button>
<button class="hcard livec" id="goLive">${ic('flag')}<b>現場小抄</b><small>主持速查・大字英文提示</small></button>
</div>
<div class="home-sub">
<button class="btn" id="goSim">${ic('star')}進階情境模擬</button>
<button class="btn" id="goAI">${ic('mic')}AI 口語陪練</button>
</div>
<div class="home-foot">
<button class="footbtn" id="goStk"><img src="${IMG('cat-happy')}" alt="">貼紙收藏<small>${DB.stickers.length}/9</small></button>
<button class="footbtn" id="goRec">${ic('clock')}練習紀錄</button>
<button class="footbtn" id="goSet">${ic('grid')}設定</button>
</div>
<div class="offline" id="offline"></div>
<div id="updBanner"></div>
<div class="footer">© 2026 啾啾菇｜V${APP_VERSION}</div>
</div>`;
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => { DB.role = ROLE = b.dataset.role; save(); renderStart(); });
  $('#goReview').onclick = renderCardSetup;
  $('#goWeak').onclick = renderWeak;
  $('#goLib').onclick = () => renderCheat({ from: 'start', tab: CH.tab || 0, role: DB.role });
  $('#goLive').onclick = openLive;
  $('#goSim').onclick = renderSimStart;
  $('#goAI').onclick = renderAI;
  $('#goStk').onclick = renderStickers;
  $('#goRec').onclick = renderRecords;
  $('#goSet').onclick = renderSettings;
  showOfflineStatus($('#offline'));
  showUpdateBanner();
  window.scrollTo(0, 0);
};

/* =========================================================
   快速複習（口說卡片擴充）
   ========================================================= */
function reviewFilterKeys(f) {
  if (f.keys) return f.keys.filter(k => cheatEntry(k));
  const role = f.role === 'auto' ? DB.role : f.role;
  let keys = allKeys().filter(k => {
    const d = cheatEntry(k); if (!d) return false;
    if (f.sec && d.sec !== f.sec) return false;
    if (f.type !== 'all' && d.type !== f.type) return false;
    if (role !== 'all' && (d.role || 'host') !== role) return false;
    if (f.status === 'newmod' ? !['new', 'modified'].includes(d.status) : f.status !== 'all' && d.status !== f.status) return false;
    const lv = levelOf(k);
    if (f.mastery === 'none' && lv) return false;
    if (f.mastery !== 'all' && f.mastery !== 'none' && lv !== f.mastery) return false;
    if (f.fav && !isFav(k)) return false;
    return true;
  });
  return keys;
}
function orderKeys(keys, order) {
  if (order === 'flow') { const all = allKeys(); return [...keys].sort((a, b) => all.indexOf(a) - all.indexOf(b)); }
  const pri = k => { const c = DB.cards[k]; if (!c || !c.level) return .45; if (c.level === 'bad') return .1; if (c.level === 'shaky') return .25; return .6 + Math.min(c.streak || 0, 4) * .1; };
  return [...keys].sort((a, b) => (pri(a) + Math.random() * .3) - (pri(b) + Math.random() * .3));
}
renderCardSetup = function () {
  CARD = null; window.__rerender = renderCardSetup;
  const f = DB.review;
  const keys = reviewFilterKeys(f);
  const chip = (g, v, label) => `<button class="pill cset${String(f[g]) === String(v) ? ' on' : ''}" data-g="${g}" data-v="${v}">${label}</button>`;
  const roleNow = f.role === 'auto' ? `跟首頁一樣（${DB.role === 'host' ? '關主' : '小幫手'}）` : '';
  app.innerHTML = `<div class="start">
<div class="topbar"><div class="l"><button class="iconbtn" id="csBack" aria-label="回首頁">${ic('back')}</button><h2>快速複習</h2></div></div>
<div class="card" style="font-size:14px;line-height:1.7;padding:12px 16px">看情境 → <b>大聲說出英文</b> → 翻卡對答案 → 自評。不用打字、不用麥克風。</div>
<b>快速開始</b>
<div class="quick3">${[5, 10, 20].map(n => `<button class="btn ${n === 10 ? 'pink' : ''} qs" data-n="${n}"><b class="en" style="font-size:22px">${n}</b><small>${n === 5 ? '超短複習' : n === 10 ? '日常複習' : '完整複習'}</small></button>`).join('')}</div>
<div class="muted" style="font-size:13px">目前條件共有 <b style="color:var(--ink)">${keys.length}</b> 句${keys.length < 20 ? '；題庫不足時會用全部符合的句子，不重複湊數' : ''}。</div>
<details class="filters" ${f._open ? 'open' : ''}><summary>進階篩選</summary>
<div class="fgroup"><span>類型</span>${chip('type', 'base', '基本句')}${chip('type', 'ext', '延伸句')}${chip('type', 'all', '全部')}</div>
<div class="fgroup"><span>角色</span>${chip('role', 'auto', roleNow || '跟首頁一樣')}${chip('role', 'host', '關主')}${chip('role', 'helper', '小幫手')}${chip('role', 'all', '全部')}</div>
<div class="fgroup"><span>段落</span>${chip('sec', '', '全部段落')}${SECS.map(s => chip('sec', s, s)).join('')}</div>
<div class="fgroup"><span>狀態</span>${chip('status', 'all', '全部')}${chip('status', 'new', '新增')}${chip('status', 'modified', '修改')}${chip('status', 'retained', '保留')}${chip('status', 'newmod', '新增＋修改')}</div>
<div class="fgroup"><span>熟練度</span>${chip('mastery', 'all', '全部')}${chip('mastery', 'none', '尚未練習')}${chip('mastery', 'bad', '不熟')}${chip('mastery', 'shaky', '有點卡')}${chip('mastery', 'good', '熟練')}</div>
<div class="fgroup"><span>收藏</span>${chip('fav', false, '全部')}${chip('fav', true, '只練收藏')}</div>
<div class="fgroup"><span>順序</span>${chip('order', 'random', '隨機（不熟的優先）')}${chip('order', 'flow', '依活動流程')}</div>
</details>
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#csBack').onclick = renderStart;
  $('.filters').ontoggle = e => { f._open = e.target.open; };
  document.querySelectorAll('.cset').forEach(b => b.onclick = () => { const v = b.dataset.v; f[b.dataset.g] = v === 'true' ? true : v === 'false' ? false : v; f._open = true; save(); const y = window.scrollY; renderCardSetup(); window.scrollTo(0, y); });
  document.querySelectorAll('.qs').forEach(b => b.onclick = () => { f.count = +b.dataset.n; save(); startCards(Object.assign({}, f, { count: +b.dataset.n })); });
  window.scrollTo(0, 0);
};
startCards = function (f) {
  let keys = reviewFilterKeys(f);
  if (!keys.length) { toast('這個條件沒有句子，換個條件試試'); return; }
  if (f.order !== 'keep') keys = orderKeys(keys, f.order || 'random');
  const n = f.keys ? keys.length : Math.min(f.count || 10, keys.length);
  keys = keys.slice(0, n);
  CARD = { f, queue: keys.map(k => ({ k, retry: false })), base: keys.length, idx: 0, flipped: false, showZh: false, first: {}, last: {}, tries: {}, t0: Date.now(), done: 0 };
  renderCard();
};
cardMark = function (lv) {
  const it = CARD.queue[CARD.idx]; const k = it.k;
  const c = DB.cards[k] || (DB.cards[k] = { streak: 0, level: null, n: 0, badN: 0 });
  c.n++; c.last = Date.now(); c.changed = false;
  if (lv === 'good') { c.streak = (c.streak || 0) + 1; c.level = 'good'; c.bad = false; }
  else if (lv === 'shaky') { c.streak = 0; c.level = 'shaky'; c.bad = false; }
  else { c.streak = 0; c.level = 'bad'; c.bad = true; c.badN = (c.badN || 0) + 1; c.lastBad = Date.now(); }
  if (!(k in CARD.first)) CARD.first[k] = lv;
  CARD.last[k] = lv;
  if (!it.retry) CARD.done++;
  if (lv === 'bad') {
    CARD.tries[k] = (CARD.tries[k] || 0) + 1;
    if (CARD.tries[k] <= 2) CARD.queue.splice(Math.min(CARD.idx + 3 + rnd(3), CARD.queue.length), 0, { k, retry: true });
  }
  save();
  CARD.idx++; CARD.flipped = false; CARD.showZh = false;
  renderCard();
};
renderCard = function () {
  if (!CARD) { renderCardSetup(); return; }
  window.__rerender = null;
  if (CARD.idx >= CARD.queue.length) { renderCardDone(); return; }
  const it = CARD.queue[CARD.idx]; const k = it.k; const d = cheatEntry(k);
  const retries = CARD.queue.filter(x => x.retry).length;
  const ani = ALL_ANIMALS[[...k].reduce((a, ch) => a + ch.charCodeAt(0), 0) % ALL_ANIMALS.length];
  const alts = (d.alts || []).filter(a => a !== d.en);
  const fav = isFav(k);
  const front = `<div class="fc-front">
<span class="fc-say">${ic('mic')}大聲說出來！</span>
${CARD.showZh ? `<div class="fc-zh">${esc(d.zh)}</div>` : `<button class="btn" id="fcZh" style="min-height:44px;font-size:14px">${ic('bulb')}看中文提示</button>`}
<span class="muted" style="font-size:13px">說完點卡片或下方按鈕翻面</span></div>`;
  const back = `<div class="fc-back">
<div class="ci-h"><span class="en fc-en">${esc(d.en)}</span><button class="iconbtn say" data-say="${esc(d.en)}" aria-label="播放發音">${ic('sound')}</button></div>
<div class="ci-zh" style="font-size:15px">${esc(d.zh)}</div>
${alts.length ? `<div class="ci-alt"><span class="ci-alt-l">也可以說</span>${alts.map(a => `<div class="ci-alt-row"><span class="en">${esc(a)}</span><button class="iconbtn say sm" data-say="${esc(a)}" aria-label="播放發音">${ic('sound')}</button></div>`).join('')}</div>` : ''}
${d.note ? `<div class="ci-note">${esc(d.note)}</div>` : ''}${d.template ? '<div class="ci-note">數字／顏色／品牌會依現場情況替換</div>' : ''}</div>`;
  app.innerHTML = `<div class="cardwrap">
<div class="topbar"><div class="l"><button class="iconbtn" id="fcHome" aria-label="結束">${ic('home')}</button><h2>快速複習</h2></div>
<div class="r"><div class="prog"><b style="color:var(--ink)">${Math.min(CARD.done + (it.retry ? 0 : 1), CARD.base)} / ${CARD.base}</b>${retries ? `<span class="pill" style="padding:1px 8px;font-size:12px">補考 ${retries}</span>` : ''}<div class="bar"><i style="width:${CARD.done / CARD.base * 100}%"></i></div></div><button class="iconbtn" id="fcCheat" aria-label="完整話術庫">${ic('book')}</button></div></div>
<div class="fc${CARD.flipped ? ' flipped' : ''}" id="fc" role="button" tabindex="0" aria-label="${CARD.flipped ? '卡片背面' : '點一下翻卡'}">
<div class="fc-top"><img src="${IMG(ani + (CARD.flipped ? '-happy' : '-n'))}" alt=""><div style="display:flex;gap:6px;flex-wrap:wrap;flex:1"><span class="pill" style="background:var(--mint)">${esc(d.sec)}</span><span class="pill ${d.type === 'base' ? 'tagbase' : 'tagext'}">${d.type === 'base' ? '基本句' : '延伸句'}</span>${d.role === 'helper' ? '<span class="pill" style="background:var(--sky)">小幫手</span>' : ''}${d.status && d.status !== 'retained' ? `<span class="pill">${STATUS_ZH[d.status]}</span>` : ''}${it.retry ? '<span class="pill" style="background:#FDE3EA">補考</span>' : ''}</div>
<button class="iconbtn favbtn${fav ? ' on' : ''}" id="fcFav" aria-label="${fav ? '取消收藏' : '收藏'}" aria-pressed="${fav}">${ic('star')}</button></div>
<p class="fc-sit">${esc(d.sit || d.zh)}</p>
${CARD.flipped ? back : front}
</div>
${CARD.flipped ? `<div class="fc-acts3"><button class="btn" id="lvBad">說不出來</button><button class="btn butter" id="lvShaky">有點卡住</button><button class="btn pink" id="lvGood">${ic('check')}很順利</button></div><div class="muted" style="font-size:12px;text-align:center">這是你自己的感覺，不是 AI 評分</div>` : `<button class="btn butter" id="fcFlip" style="width:100%;min-height:54px;font-size:16px">翻卡看答案</button>`}
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#fcHome').onclick = () => { if (CARD.done > 0) renderCardDone(); else renderCardSetup(); };
  $('#fcCheat').onclick = () => renderCheat({ from: 'card' });
  $('#fcFav').onclick = e => { e.stopPropagation(); toast(toggleFav(k) ? '已收藏' : '已取消收藏'); renderCard(); };
  const flip = () => { if (CARD.flipped) return; CARD.flipped = true; renderCard(); if (DB.autoSpeak) speak(d.en); };
  $('#fc').onclick = e => { if (e.target.closest('button')) return; flip(); };
  if ($('#fcFlip')) $('#fcFlip').onclick = flip;
  if ($('#fcZh')) $('#fcZh').onclick = e => { e.stopPropagation(); CARD.showZh = true; renderCard(); };
  if ($('#lvBad')) { $('#lvBad').onclick = () => cardMark('bad'); $('#lvShaky').onclick = () => cardMark('shaky'); $('#lvGood').onclick = () => cardMark('good'); }
  document.querySelectorAll('[data-say]').forEach(b => b.onclick = e => { e.stopPropagation(); speak(b.dataset.say); });
};
renderCardDone = function () {
  const ks = Object.keys(CARD.first);
  const firstGood = ks.filter(k => CARD.first[k] === 'good').length;
  const shaky = ks.filter(k => CARD.last[k] === 'shaky').length;
  const bad = ks.filter(k => CARD.first[k] === 'bad').length;
  const notYet = ks.filter(k => CARD.last[k] !== 'good');
  const secs = Math.round((Date.now() - CARD.t0) / 1000);
  let sticker = null;
  if (!CARD.logged && ks.length) {
    CARD.logged = true;
    DB.cardLog.push({ t: Date.now(), n: ks.length, good: firstGood, shaky, bad, secs });
    if (DB.cardLog.length > 60) DB.cardLog.splice(0, DB.cardLog.length - 60);
    if (ks.length >= 10) { const left = ALL_ANIMALS.filter(a => !DB.stickers.includes(a)); if (left.length) { sticker = pick(left); DB.stickers.push(sticker); } }
    save();
  }
  app.innerHTML = `<div class="report">
<div class="head"><h1>複習完成</h1><span class="pill" style="background:var(--butter)">${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</span></div>
<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="stats"><div class="stat"><b>${ks.length}</b><small>練習句數</small></div><div class="stat"><b>${firstGood}</b><small>第一次就順</small></div><div class="stat"><b>${shaky}</b><small>有點卡</small></div><div class="stat"><b>${bad}</b><small>說不出來</small></div></div></div>
${sticker ? `<div class="newsticker"><img src="${IMG(sticker + '-happy')}" alt=""><div><b>獲得新貼紙：${ZH_NAME[sticker]}！</b><div class="muted" style="font-size:13px">已收集 ${DB.stickers.length} / 9</div></div></div>` : ''}
${notYet.length ? `<h3>還不夠熟的句子</h3>${notYet.map(k => { const d = cheatEntry(k); return `<div class="ci"><div class="ci-h"><span class="en">${esc(d.en)}</span><button class="iconbtn say" data-say="${esc(d.en)}" aria-label="播放發音">${ic('sound')}</button></div><div class="ci-zh">${esc(d.zh)}</div><div class="ci-tags"><span class="pill">${LEVEL_ZH[CARD.last[k]]}</span></div></div>`; }).join('')}` : '<div class="ci">這輪最後都說得很順利，太棒了！</div>'}
<div class="actgrid">
${notYet.length ? `<button class="btn pink" id="cdAgain">${ic('target')}只練不熟的</button><button class="btn" id="cdFav">${ic('star')}全部收藏</button>` : ''}
<button class="btn mint" id="cdMore">${ic('repeat')}再練一輪</button>
<button class="btn" id="cdHome">${ic('home')}回首頁</button></div>
<div class="footer">© 2026 啾啾菇</div></div>`;
  const f = CARD.f;
  if ($('#cdAgain')) $('#cdAgain').onclick = () => startCards({ keys: shuffle(notYet) });
  if ($('#cdFav')) $('#cdFav').onclick = () => { notYet.forEach(k => { if (!isFav(k)) DB.fav.push(k); }); save(); toast(`已收藏 ${notYet.length} 句`); };
  $('#cdMore').onclick = () => startCards(f);
  $('#cdHome').onclick = renderStart;
  document.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
  window.scrollTo(0, 0);
};

/* =========================================================
   弱點加強
   ========================================================= */
let WK = { tab: 'all', sec: '' };
function renderWeak() {
  CARD = null; window.__rerender = renderWeak;
  const role = DB.role;
  let keys = weakKeysAll(role);
  const simBad = k => { const v = DB.stats[`${role}:${k}`]; return v ? (v.n - v.ok) + v.hint : 0; };
  const cnt = k => ((DB.cards[k] && DB.cards[k].badN) || 0) + simBad(k);
  if (WK.tab === 'most') keys.sort((a, b) => cnt(b) - cnt(a));
  if (WK.tab === 'recent') keys = keys.filter(k => DB.cards[k] && DB.cards[k].lastBad).sort((a, b) => DB.cards[b].lastBad - DB.cards[a].lastBad);
  if (WK.tab === 'manual') keys = DB.weakManual.filter(k => cheatEntry(k) && roleOk(k, role));
  if (WK.sec) keys = keys.filter(k => secOf(k) === WK.sec);
  const src = k => { const t = []; const c = DB.cards[k]; if (c && c.level === 'bad') t.push('說不出來'); if (c && c.level === 'shaky') t.push('有點卡'); if (simBad(k)) t.push('模擬答錯／看提示'); if (DB.weakManual.includes(k)) t.push('手動加入'); return t; };
  const tab = (v, l) => `<button class="pill cset${WK.tab === v ? ' on' : ''}" data-t="${v}">${l}</button>`;
  app.innerHTML = `<div class="start">
<div class="topbar"><div class="l"><button class="iconbtn" id="wkBack" aria-label="回首頁">${ic('back')}</button><h2>弱點加強</h2></div><span class="pill">${role === 'host' ? '關主' : '小幫手'}</span></div>
<div class="chfilters">${tab('all', '全部待加強')}${tab('most', '最常出錯')}${tab('recent', '最近出錯')}${tab('manual', '手動加入')}</div>
<label class="sr" for="wkSec">段落</label><select id="wkSec" class="sel"><option value="">全部段落</option>${SECS.map(s => `<option ${WK.sec === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
${keys.length ? `<div class="quick3">${[5, 10, 20].map(n => `<button class="btn ${n === 10 ? 'pink' : ''} wkgo" data-n="${n}"><b class="en" style="font-size:20px">${Math.min(n, keys.length)}</b><small>張</small></button>`).join('')}</div>
<div class="chlist">${keys.map(k => { const d = cheatEntry(k); return `<div class="ci"><div class="ci-h"><span class="en">${esc(d.en)}</span><button class="iconbtn say" data-say="${esc(d.en)}" aria-label="播放發音">${ic('sound')}</button></div><div class="ci-zh">${esc(d.zh)}</div><div class="ci-tags"><span class="pill">${esc(d.sec)}</span>${src(k).map(t => `<span class="pill">${t}</span>`).join('')}${DB.weakManual.includes(k) ? `<button class="pill rmweak" data-k="${k}">移出清單</button>` : ''}</div></div>`; }).join('')}</div>`
    : `<div class="card" style="text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center"><img src="${IMG('bear-happy')}" alt="" style="width:70px"><b>尚無待加強話術</b><span class="muted" style="font-size:14px">用快速複習時按「說不出來」或「有點卡住」，或在話術庫按「加入待加強」，句子就會出現在這裡。</span><button class="btn pink" id="wkReview">${ic('cards')}開始快速複習</button></div>`}
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#wkBack').onclick = renderStart;
  document.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { WK.tab = b.dataset.t; renderWeak(); });
  $('#wkSec').onchange = e => { WK.sec = e.target.value; renderWeak(); };
  document.querySelectorAll('.wkgo').forEach(b => b.onclick = () => startCards({ keys: (WK.tab === 'all' ? orderKeys(keys, 'random') : keys).slice(0, +b.dataset.n), order: 'keep' }));
  document.querySelectorAll('.rmweak').forEach(b => b.onclick = () => { DB.weakManual = DB.weakManual.filter(x => x !== b.dataset.k); save(); renderWeak(); });
  if ($('#wkReview')) $('#wkReview').onclick = renderCardSetup;
  document.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

/* =========================================================
   完整話術庫（原話術小抄）
   ========================================================= */
Object.assign(CH, { type: 'all', status: 'all', fav: false, weak: false, live: false, duty: 'all' });
function libKeys() {
  const q = CH.q.trim().toLowerCase();
  const weak = new Set(weakKeysAll('all'));
  const base = q ? allKeys() : (CH.tab < CHEAT_TABS.length ? CHEAT_TABS[CH.tab].keys : []);
  return base.filter(k => {
    const d = cheatEntry(k); if (!d) return false;
    if (CH.type !== 'all' && d.type !== CH.type) return false;
    if (CH.role !== 'all' && (d.role || 'host') !== CH.role) return false;
    if (CH.status !== 'all' && d.status !== CH.status) return false;
    if (CH.duty !== 'all' && d.duty !== CH.duty) return false;
    if (CH.fav && !isFav(k)) return false;
    if (CH.weak && !weak.has(k)) return false;
    if (CH.live && !isLive(k)) return false;
    if (q) { const hay = [d.en, d.zh, ...(d.alts || []), d.sit || '', d.note || '', d.sec, d.event ? '臨時狀況' : ''].join(' ').toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
}
cheatItemHTML = function (k) {
  const d = cheatEntry(k); if (!d) return '';
  const alts = (d.alts || []).filter(a => a !== d.en);
  const fav = isFav(k);
  return `<div class="ci">
<div class="ci-h"><span class="en">${esc(d.en)}</span><span class="ci-btns"><button class="iconbtn say" data-say="${esc(d.en)}" aria-label="播放發音">${ic('sound')}</button><button class="iconbtn favbtn${fav ? ' on' : ''}" data-fav="${k}" aria-label="${fav ? '取消收藏' : '收藏'}" aria-pressed="${fav}">${ic('star')}</button></span></div>
<div class="ci-zh">${esc(d.zh)}</div>
<div class="ci-tags"><span class="pill ${d.type === 'base' ? 'tagbase' : 'tagext'}">${d.type === 'base' ? '基本' : '延伸'}</span><span class="pill">${DUTY_ZH[d.duty] || (d.role === 'helper' ? '小幫手' : '關主')}</span>${d.status ? `<span class="pill">${STATUS_ZH[d.status]}</span>` : ''}${d.practice ? '<span class="pill" style="background:#E8E1F5">練習範例</span>' : ''}${isLive(k) ? '<span class="pill" style="background:#FFE2C2">現場</span>' : ''}${levelOf(k) ? `<span class="pill">${LEVEL_ZH[levelOf(k)]}</span>` : ''}</div>
<details class="ci-more"><summary>更多：情境、其他說法、說明</summary>
<div class="ci-sit">情境：${esc(d.sit || '—')}</div>
${alts.length ? `<div class="ci-alt"><span class="ci-alt-l">也可以說</span>${alts.map(a => `<div class="ci-alt-row"><span class="en">${esc(a)}</span><button class="iconbtn say sm" data-say="${esc(a)}" aria-label="播放發音">${ic('sound')}</button></div>`).join('')}</div>` : ''}
${d.note ? `<div class="ci-note">${esc(d.note)}</div>` : ''}${d.template ? '<div class="ci-note">數字／顏色／品牌會依情況替換，這裡是範例</div>' : ''}
<button class="btn addweak" data-k="${k}" style="min-height:40px;font-size:13px;align-self:flex-start">${ic('target')}加入待加強</button>
</details></div>`;
};
function toolHTML(name) {
  if (name === '一題示範') return `<div class="ci"><span class="muted" style="font-size:13px">以全聯（三色）為例。正式題目只要換題號、顏色數、答案、分數和品牌。注意：計分完成後才請學生放下手，再介紹品牌。</span></div>` +
    DEMO_FLOW.map(x => x[0] === 'act' ? `<div class="demo-act">▸ ${esc(x[1])}</div>` : `<div class="ci demo"><div class="ci-h"><span class="en">${esc(x[1])}</span><button class="iconbtn say" data-say="${esc(x[1])}" aria-label="播放發音">${ic('sound')}</button></div><div class="ci-zh">${esc(x[2])}</div></div>`).join('');
  const sayRow = (en, zh) => `<div class="ci-h"><span class="en" style="font-size:16px">${esc(en)}</span><button class="iconbtn say sm" data-say="${esc(en)}" aria-label="播放發音">${ic('sound')}</button></div>${zh ? `<div class="ci-zh">${esc(zh)}</div>` : ''}`;
  return `<div class="ci"><b>八種手環顏色</b><div class="colorgrid">${Object.values(COLORS).map(c => `<button class="colorchip" data-say="${c.en}"><i style="background:${c.hex}"></i><span class="en">${cap(c.en)}</span><small>${c.zh}色</small></button>`).join('')}</div></div>
<div class="ci"><b>數字 0～30</b><div class="numgrid">${Array.from({ length: 31 }, (_, n) => `<button class="numchip" data-say="${nw(n)}"><b class="en">${n}</b><small class="en">${nw(n)}</small></button>`).join('')}</div></div>
<div class="ci"><b>分數、手、顏色（單複數）</b>${sayRow('One point for Team A!', '一分用 point')}${sayRow('Two points for Team B!', '兩分以上用 points')}${sayRow('Team B has seven points.', 'B 隊目前 7 分')}${sayRow('Each team can raise up to one hand.', '一隻手 hand')}${sayRow('This logo has four colors.', '四個顏色 colors')}</div>
<div class="ci"><b>念答案的句型</b>${sayRow('The correct colors are red and white!', '兩色用 and')}${sayRow('The correct colors are black, white, orange, and brown!', '三色以上用逗號，最後一個前面加 and')}</div>`;
}
renderCheat = function (opts) {
  if (opts) Object.assign(CH, opts);
  try { if (rec) rec.abort(); } catch (e) { /* ignore */ }
  window.__rerender = null;
  const tabs = [...SECS, '一題示範', '顏色數字'];
  const f = (g, v, l) => `<button class="pill chf2${String(CH[g]) === String(v) ? ' on' : ''}" data-g="${g}" data-v="${v}">${l}</button>`;
  app.innerHTML = `<div class="cheat">
<div class="topbar" style="margin-bottom:8px"><div class="l"><button class="iconbtn" id="chBack" aria-label="返回">${ic('back')}</button><h2>完整話術庫</h2></div>
<div class="r"><label class="sr" for="chq">搜尋</label><input id="chq" class="chsearch" type="search" placeholder="搜尋英文、中文、情境⋯" value="${esc(CH.q)}"></div></div>
<details class="filters" id="chFilt"${CH._open ? ' open' : ''}><summary>篩選${(CH.type !== 'all' || CH.role !== 'all' || CH.duty !== 'all' || CH.status !== 'all' || CH.fav || CH.weak || CH.live) ? '（已套用）' : ''}</summary>
<div class="fgroup"><span>類型</span>${f('type', 'all', '全部')}${f('type', 'base', '基本')}${f('type', 'ext', '延伸')}</div>
<div class="fgroup"><span>角色</span>${f('role', 'all', '全部')}${f('role', 'host', '關主')}${f('role', 'helper', '小幫手')}</div>
<div class="fgroup"><span>分工</span>${f('duty', 'all', '全部')}${f('duty', 'host1', '關主 1')}${f('duty', 'host2', '關主 2')}${f('duty', 'helper', '小幫手')}${f('duty', 'shared', '共用')}</div>
<div class="fgroup"><span>狀態</span>${f('status', 'all', '全部')}${f('status', 'new', '新增')}${f('status', 'modified', '修改')}${f('status', 'retained', '保留')}</div>
<div class="fgroup"><span>只看</span>${f('fav', !CH.fav, CH.fav ? '✓ 收藏' : '收藏')}${f('weak', !CH.weak, CH.weak ? '✓ 待加強' : '待加強')}${f('live', !CH.live, CH.live ? '✓ 現場核心' : '現場核心')}</div>
<button class="linkbtn" id="chClear">清除全部篩選</button></details>
<div class="chtabs" role="tablist" id="chTabs">${tabs.map((t, i) => `<button role="tab" aria-selected="${i === CH.tab}" class="chtab${i === CH.tab ? ' on' : ''}" data-t="${i}">${esc(t)}</button>`).join('')}</div>
<div class="chlist" id="chList"></div>
${CH.from === 'play' ? `<button class="btn pink" id="chResume" style="width:100%;margin-top:14px">回到模擬</button>` : CH.from === 'card' ? `<button class="btn pink" id="chResume" style="width:100%;margin-top:14px">回到快速複習</button>` : ''}
<div class="footer">© 2026 啾啾菇</div></div>`;
  const drawList = () => {
    const q = CH.q.trim();
    const tabsEl = $('#chTabs'); if (tabsEl) tabsEl.style.display = q ? 'none' : '';
    let html;
    if (!q && CH.tab >= CHEAT_TABS.length) html = toolHTML(tabs[CH.tab]);
    else { const ks = libKeys(); html = (q ? `<div class="muted" style="font-size:13px">找到 ${ks.length} 句</div>` : `<div class="muted" style="font-size:13px">${esc(tabs[CH.tab])}｜${ks.length} 句</div>`) + (ks.length ? ks.map(cheatItemHTML).join('') : '<div class="ci muted">沒有符合條件的句子</div>'); }
    $('#chList').innerHTML = html;
    $('#chList').querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
    $('#chList').querySelectorAll('[data-fav]').forEach(b => b.onclick = () => { const on = toggleFav(b.dataset.fav); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); toast(on ? '已收藏' : '已取消收藏'); });
    $('#chList').querySelectorAll('.addweak').forEach(b => b.onclick = () => addWeak(b.dataset.k));
  };
  drawList();
  const back = () => { if (CH.from === 'play' && S.steps) renderPlay(); else if (CH.from === 'card' && CARD) renderCard(); else renderStart(); };
  $('#chBack').onclick = back;
  if ($('#chResume')) $('#chResume').onclick = back;
  $('#chFilt').ontoggle = e => { CH._open = e.target.open; };
  document.querySelectorAll('.chtab').forEach(b => b.onclick = () => { CH.tab = +b.dataset.t; document.querySelectorAll('.chtab').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); b.scrollIntoView({ inline: 'center', block: 'nearest' }); drawList(); });
  document.querySelectorAll('.chf2').forEach(b => b.onclick = () => { const v = b.dataset.v; CH[b.dataset.g] = v === 'true' ? true : v === 'false' ? false : v; const y = window.scrollY; renderCheat(); window.scrollTo(0, y); });
  $('#chClear').onclick = () => { Object.assign(CH, { type: 'all', role: 'all', status: 'all', fav: false, weak: false, live: false, duty: 'all', q: '' }); renderCheat(); };
  $('#chq').oninput = e => { CH.q = e.target.value; drawList(); };
  if (opts) window.scrollTo(0, 0);
};

/* =========================================================
   現場小抄
   ========================================================= */
const LS_DEFAULT = () => ({ started: false, sec: '01 開場', round: 1, q: 1, card: null, ncolors: null, scores: {}, pend: null, hist: [], result: null, finalA: null, finalB: null, tieWinner: null, view: 'sec', more: false });
let LV = null; // { overlay: null|'nav'|'emg', emg: index, open: Set }
function lsGet() {
  if (!DB.liveState) DB.liveState = LS_DEFAULT();
  const st = DB.liveState;
  if (!st.scores) { // V5.0 的舊格式：只留段落、回合、題號
    ['A', 'B', 'pendA', 'pendB', 'lastA', 'lastB', 'hist', 'tieWinner', 'scoreOpen'].forEach(k => delete st[k]);
    st.ncolors = null;
  }
  const d = LS_DEFAULT(); for (const k in d) if (!(k in st)) st[k] = d[k];
  for (const r of Object.values(st.scores)) { const c = r.card && CARDS.find(x => x.code === r.card); if (c) r.n = c.colors.length; } // 題卡顏色數更新時重新驗證（例：中壢高商改為五色）
  return st;
}
function lsSave() { save(); }
const qidOf = st => `${st.round}-${st.q}`;
const cardOf = st => st.card ? CARDS.find(c => c.code === st.card) : null;
const nOf = st => { const c = cardOf(st); return c ? c.colors.length : (st.ncolors || null); };
const isInt = v => Number.isInteger(v) && v >= 0;
function liveTotals(st) { let A = 0, B = 0; for (const r of Object.values(st.scores)) { A += r.A; B += r.B; } return { A, B, k: Object.keys(st.scores).length }; }
const TOTAL_Q = 9;
/* 換題、換題卡、換色數後：清掉不屬於這題或超過上限的待確認得分 */
function checkPending(st) {
  const p = st.pend; if (!p) return;
  if (p.qid !== qidOf(st)) { st.pend = null; return; }
  const n = nOf(st);
  if (n == null) return;
  let cut = false;
  for (const t of ['A', 'B']) if (p[t] != null && p[t] > n) { p[t] = null; cut = true; }
  if (cut) toast(`這題只有 ${n} 色，超過 ${n} 分的待確認得分已清除`);
  if (p.A == null && p.B == null) st.pend = null;
}
function setPend(st, t, d) {
  const n = nOf(st); if (n == null) { toast('先選題卡或色數'); return; }
  const q = qidOf(st);
  if (!st.pend || st.pend.qid !== q) { const rec = st.scores[q]; st.pend = { qid: q, A: rec ? rec.A : null, B: rec ? rec.B : null }; }
  const cur = st.pend[t] == null ? 0 : st.pend[t];
  st.pend[t] = st.pend[t] == null && d > 0 ? Math.min(n, 0 + d) : Math.max(0, Math.min(n, cur + d));
}
/* 確認本題得分：同一題再確認會更新，不重複累加 */
function confirmScore(st, ask = confirm) {
  const n = nOf(st); const q = qidOf(st); const p = st.pend;
  if (n == null) return '先選題卡或色數，才能確認得分';
  if (!p || p.qid !== q || p.A == null || p.B == null) return '兩隊的本題得分都要輸入（0 分也要按一下）';
  if (!isInt(p.A) || !isInt(p.B)) return '得分必須是 0 以上的整數';
  if (p.A > n || p.B > n) return `這題只有 ${n} 色，得分不能超過 ${n}`;
  const old = st.scores[q];
  const msg = old ? `第 ${st.round} 回合第 ${st.q} 題已經計過分（A ${old.A}：${old.B} B）。\n要改成 A ${p.A}：${p.B} B 嗎？（會更新這題，不會重複加分）` : `確認第 ${st.round} 回合第 ${st.q} 題得分？\nA 隊 ${p.A} 分、B 隊 ${p.B} 分`;
  if (!ask(msg)) return null;
  st.hist.push(JSON.stringify(st.scores));
  if (st.hist.length > 30) st.hist.shift();
  st.scores[q] = { A: p.A, B: p.B, n, card: st.card || null, nc: st.card ? null : st.ncolors };
  st.pend = null;
  return 'ok';
}
let wakeLock = null;
async function requestWake() {
  if (!DB.liveCfg.wake) return;
  try { if ('wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) { wakeLock = null; }
}
function releaseWake() { try { if (wakeLock) wakeLock.release(); } catch (e) { /* ignore */ } wakeLock = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && LV && !wakeLock) requestWake(); });

const B3 = '___';
let LIVE_CTX = null; // 主持速查用的暫時情境（不影響完整流程的紀錄）
const lctx = () => LIVE_CTX || lsGet();
function liveText(k) {
  const st = lctx(); const cfg = DB.liveCfg;
  const card = cardOf(st); const n = nOf(st);
  const d = cheatEntry(k);
  const elec = cfg.scoreMode === 'elec' && !st.quick;
  const rec = st.scores[qidOf(st)];
  const pend = st.pend && st.pend.qid === qidOf(st) ? st.pend : null;
  const noN = '先選題卡或色數，數字會自動帶入';
  switch (k) {
    case 'round': { const r = DYN_CHEAT['round' + st.round]; return { en: r.en, zh: r.zh }; }
    case 'grouping': { const b = cfg.size === 9 ? 5 : 4; return { en: `Four over here, please. ${b === 5 ? 'Five' : 'Four'} over there, please.`, zh: `請四位到這邊，${b === 5 ? '五' : '四'}位到那邊。` }; }
    case 'qintro': return st.q === 1 ? { en: "Here's the first logo!", zh: '這是第一個標誌！' } : { en: "Here's the next logo!", zh: '這是下一個標誌！' };
    case 'hascolors': return n ? { en: `This logo has ${plural(n, 'color')}.`, zh: `這個 Logo 有${NUM_ZH[n]}個顏色。` } : { en: `This logo has ${B3} colors.`, zh: noN };
    case 'upto': return n ? { en: `Each team can raise up to ${plural(n, 'hand')}.`, zh: `每隊最多可以舉${NUM_ZH[n]}隻手。` } : { en: `Each team can raise up to ${B3} hands.`, zh: noN };
    case 'onlyn': return n ? { en: `Only ${plural(n, 'hand')}, please.`, zh: `只能舉${NUM_ZH[n]}隻手喔。` } : { en: `Only ${B3} hands, please.`, zh: noN };
    case 'canmore': return n ? { en: `You can raise up to ${plural(n, 'hand')}.`, zh: `最多可以舉${NUM_ZH[n]}隻手。` } : { en: `You can raise up to ${B3} hands.`, zh: noN };
    case 'okfewer': return n && n >= 2 ? { en: `It's okay to raise only ${plural(n - 1, 'hand')}.`, zh: `只舉${NUM_ZH[n - 1]}隻手也沒關係。` } : { en: "It's okay to raise fewer hands.", zh: '少舉幾隻手也沒關係。' };
    case 'colors': return card ? { en: `The correct colors are ${listColors(card.colors)}!`, zh: `正確的顏色是${listColorsZh(card.colors)}！` } : { en: `The correct colors are ${B3}!`, zh: '先選題卡，答案會自動出現' };
    case 'brand': return card ? { en: `This is ${card.say}.`, zh: `這是${card.zh}。`, fact: card.fact, extra: ['ohbear', 'olympic', 'ovalbrand', 'thankvisit'].find(x => LINES[x].card === card.code) || (card.origin ? (card.origin === 'tw' ? 'twbrand' : 'jpbrand') : null) } : { en: `This is ${B3}.`, zh: '先選題卡，品牌名稱會自動出現' };
    case 'points': case 'bothpoints': {
      const src = rec || (pend && pend.A != null && pend.B != null ? pend : null);
      const tag = rec ? '（本題已計分）' : src ? '（尚未確認）' : '';
      if (!src) return k === 'points' ? { en: `${B3} points for Team A! ${B3} points for Team B!`, zh: '本題得分（用下方數字選擇器可產生完整句子）' } : { en: `${B3} points for Team A and ${B3} points for Team B!`, zh: '本題兩隊得分' };
      const p = (x, t) => `${cap(plural(x, 'point'))} for Team ${t}`;
      return k === 'points' ? { en: `${p(src.A, 'A')}! ${p(src.B, 'B')}!`, zh: `A 隊得 ${src.A} 分，B 隊得 ${src.B} 分${tag}` } : { en: `${p(src.A, 'A')} and ${plural(src.B, 'point')} for Team B!`, zh: `A 隊 ${src.A} 分，B 隊 ${src.B} 分${tag}` };
    }
    case 'totals': {
      let A = null, B = null, note = '';
      if (st.sec === '09 最終' && st.finalA != null && st.finalB != null) { A = st.finalA; B = st.finalB; }
      else if (elec) { const t = liveTotals(st); A = t.A; B = t.B; note = `（電子計分，已計 ${t.k} 題）`; }
      if (A == null) return { en: `Team A has ${B3} points. Team B has ${B3} points.`, zh: elec ? '' : '紙本計分：看計分板念出分數' };
      return { en: `Team A has ${plural(A, 'point')}. Team B has ${plural(B, 'point')}.`, zh: `A 隊 ${A} 分，B 隊 ${B} 分${note}` };
    }
    case 'endround': return { en: `That's the end of round ${nw(st.round)}!`, zh: `第${NUM_ZH[st.round]}回合結束！` };
    case 'winner': return st.result === 'A' || st.result === 'B' ? { en: `Team ${st.result} wins the game!`, zh: `${st.result} 隊贏得比賽！` } : { en: `Team ${B3} wins the game!`, zh: '先在上方選擇最後結果' };
    case 'firstright': return st.tieWinner ? { en: `Team ${st.tieWinner} got all the colors right first!`, zh: `${st.tieWinner} 隊最先答對所有顏色！` } : { en: `Team ${B3} got all the colors right first!`, zh: '加賽結束後，點下方按鈕選擇勝隊' };
    default: return d ? { en: d.en, zh: d.zh } : { en: k, zh: '' };
  }
}
function kwText(k) {
  const kw = LIVE_KW[k === 'round' ? 'round' + lctx().round : k]; if (!kw) return null;
  const st = lctx(); const n = nOf(st); const card = cardOf(st);
  let en = kw[1];
  if (['hascolors', 'upto', 'onlyn', 'canmore'].includes(k) && n) en = en.replace(B3, nw(n));
  if (k === 'brand' && card) en = `This is ${card.say}`;
  if (k === 'winner' && (st.result === 'A' || st.result === 'B')) en = en.replace(B3, st.result);
  if (k === 'firstright' && st.tieWinner) en = en.replace(B3, st.tieWinner);
  if (k === 'colors' && card) en = listColors(card.colors);
  return { zh: kw[0], en };
}
function liveLineHTML(k, opts = {}) {
  const t = liveText(k); const cfg = DB.liveCfg;
  const act = LIVE_ACT[k] || (LIVE_KW[k === 'round' ? 'round' + lctx().round : k] || [])[0]; // 沒有動作提示時，用關鍵字的中文功能當提示
  let extra = '';
  if (k === 'brand' && t.extra) { const e = LINES[t.extra]; extra = `<div class="lv-extra"><span class="en">${esc(e.en)}</span>${cfg.zh ? `<small>${esc(e.zh)}</small>` : ''}</div>`; }
  if (k === 'brand' && t.fact) extra += `<div class="lv-fact"><b>Fun Fact</b> <span class="en">${esc(t.fact)}</span></div>`;
  if (k === 'firstright') extra = `<div class="lv-toggle">${['A', 'B'].map(x => `<button class="pill${lctx().tieWinner === x ? ' on' : ''}" data-tw="${x}">Team ${x} 先全對</button>`).join('')}</div>`;
  const kw = !opts.full && cfg.read === 'kw' ? kwText(k) : null;
  const uid = opts.uid || k;
  if (kw && !(LV && LV.open && LV.open.has(uid))) {
    return `<button class="lv-line lv-kw${opts.small ? ' small' : ''}" data-open="${esc(uid)}" aria-expanded="false"><span class="lv-kwzh">${esc(kw.zh)}</span><span class="lv-kwen en">${esc(kw.en)}</span><span class="lv-kwmore">點一下看完整英文</span></button>${k === 'firstright' ? extra : ''}`;
  }
  const closeBtn = kw ? `<button class="lv-kwclose" data-open="${esc(uid)}" aria-expanded="true">收回關鍵字</button>` : '';
  return `<div class="lv-line${opts.small ? ' small' : ''}">${act && !opts.small ? `<div class="lv-act">▸ ${esc(act)}</div>` : ''}<div class="lv-en en">${esc(t.en)}</div>${cfg.zh && t.zh ? `<div class="lv-zh">${esc(t.zh)}</div>` : ''}${extra}${closeBtn}</div>`;
}
function renderLiveEntry() {
  CARD = null; window.__rerender = null;
  const st = lsGet(); const cfg = DB.liveCfg;
  const seg = (g, v, l, obj = 'live') => `<button class="pill cset${String((obj === 'db' ? DB : cfg)[g]) === String(v) ? ' on' : ''}" data-obj="${obj}" data-g="${g}" data-v="${v}">${l}</button>`;
  app.innerHTML = `<div class="start live-entry">
<div class="topbar"><div class="l"><button class="iconbtn" id="leBack" aria-label="回首頁">${ic('back')}</button><h2>現場小抄｜完整流程</h2></div><button class="btn" id="leQuick" style="min-height:44px;font-size:14px">回主持速查</button></div>
${st.started ? `<div class="card" style="display:flex;flex-direction:column;gap:10px"><b>上一次的現場流程</b><span style="font-size:14px">${esc(st.sec)}｜第 ${st.round} 回合第 ${st.q} 題${Object.keys(st.scores).length ? `｜已電子計分 ${Object.keys(st.scores).length} 題` : ''}${st.result ? `｜結果：${st.result === 'tie' ? '平手' : st.result + ' 隊獲勝'}` : ''}</span>
<button class="btn pink" id="leResume" style="min-height:52px">繼續上一次</button><button class="btn" id="leNew">下一組學生（重新開始）</button></div>` : ''}
<div class="card" style="display:flex;flex-direction:column;gap:10px"><b>開場設定</b>
<div class="fgroup"><span>角色</span>${seg('role', 'host', '關主', 'db')}${seg('role', 'helper', '小幫手', 'db')}<small class="muted">和首頁同步</small></div>
<div class="fgroup"><span>人數</span>${seg('size', 9, '9 人（A 隊 4、B 隊 5）')}${seg('size', 8, '8 人（A 隊 4、B 隊 4）')}</div>
<div class="fgroup"><span>計分</span>${seg('scoreMode', 'paper', '紙本／人工（預設）')}${seg('scoreMode', 'elec', '電子計分')}</div>
<div class="fgroup"><span>閱讀</span>${seg('read', 'full', '完整英文')}${seg('read', 'kw', '關鍵字提示')}</div>
<div class="fgroup"><span>中文</span>${seg('zh', true, '顯示')}${seg('zh', false, '隱藏')}</div>
<div class="fgroup"><span>字體</span>${seg('font', 'm', '大')}${seg('font', 'l', '特大')}${seg('font', 'xl', '超大')}</div>
<div class="fgroup"><span>螢幕</span>${seg('wake', true, '保持亮著')}${seg('wake', false, '不處理')}</div>
<button class="btn pink" id="leStart" style="min-height:52px">${st.started ? '用新設定從 01 開場開始' : '開始（從 01 開場）'}</button>
<button class="btn" id="leSkip">跳過設定，直接查段落</button></div>
<div class="muted" style="font-size:12px;line-height:1.6">現場模式不會自動播放聲音、不會開麥克風、不需要網路。題目由你選手上拿的題卡，不會隨機決定。不用電子計分也能走完整場。</div>
</div>`;
  $('#leBack').onclick = renderStart;
  $('#leQuick').onclick = () => { cfg.mode = 'quick'; save(); openLive(); };
  document.querySelectorAll('.cset').forEach(b => b.onclick = () => { const o = b.dataset.obj === 'db' ? DB : cfg; const v = b.dataset.v; o[b.dataset.g] = v === 'true' ? true : v === 'false' ? false : /^\d+$/.test(v) ? +v : v; if (b.dataset.g === 'role') ROLE = DB.role; save(); renderLiveEntry(); });
  const fresh = () => { DB.liveState = Object.assign(LS_DEFAULT(), { started: true }); save(); };
  if ($('#leResume')) $('#leResume').onclick = () => enterLive();
  if ($('#leNew')) $('#leNew').onclick = () => { if (confirm('開始下一組學生？會清除這一組的回合、題號、計分和勝負結果（練習紀錄不受影響）。')) { fresh(); enterLive(); } };
  $('#leStart').onclick = () => { if (st.started && !confirm('從頭開始會清除目前這一組的回合、題號、計分和勝負結果，確定嗎？')) return; fresh(); enterLive(); };
  $('#leSkip').onclick = () => { lsGet().started = true; save(); LV = { overlay: 'nav', open: new Set() }; enterLive(true); };
  window.scrollTo(0, 0);
}
function enterLive(keepOverlay) {
  if (!keepOverlay) LV = { overlay: null, open: new Set() };
  document.body.classList.add('live-mode');
  requestWake();
  renderLive();
}
function exitLive() { LV = null; document.body.classList.remove('live-mode'); releaseWake(); renderStart(); }
let lvTimer = null;
const Q_SECS = ['05 觀察', '06 出題', '07 公布', '08 計分'];
const FLOW_SECS = ['06 出題', '07 公布', '08 計分'];
function resultHTML(st) {
  const elec = DB.liveCfg.scoreMode === 'elec';
  let sug = '';
  if (elec) {
    const t = liveTotals(st);
    const s = t.A > t.B ? 'A' : t.B > t.A ? 'B' : 'tie';
    const zh = s === 'tie' ? '兩隊平手' : `${s} 隊獲勝`;
    sug = `<div class="res-sug">電子計分：A ${t.A} : ${t.B} B（已計 ${t.k}／${TOTAL_Q} 題）${t.k ? `→ 建議「${zh}」` : ''}
${t.k < TOTAL_Q ? `<div class="res-warn">⚠ 計分不完整，請和計分板確認後再選結果</div>` : ''}
${t.k ? `<button class="btn" id="resSug" style="min-height:44px">採用建議（${zh}）</button>` : ''}</div>`;
  }
  const b = (v, l) => `<button class="lvb res${st.result === v ? ' on' : ''}" data-res="${v}">${l}</button>`;
  const num = (t) => `<label class="res-num">${t} 隊<input type="number" inputmode="numeric" min="0" step="1" id="fin${t}" value="${st['final' + t] ?? ''}" placeholder="—"></label>`;
  let warn = '';
  if (st.finalA != null && st.finalB != null && st.result) {
    const real = st.finalA > st.finalB ? 'A' : st.finalB > st.finalA ? 'B' : 'tie';
    if (real !== st.result) warn = '<div class="res-warn">⚠ 填的分數和選的結果不一致，請再確認</div>';
  }
  return `<div class="lv-result"><b>最後結果（由你確認）</b>${sug}
<div class="res-btns">${b('A', 'A 隊獲勝')}${b('B', 'B 隊獲勝')}${b('tie', '兩隊平手')}</div>
<details class="res-more"${st.finalA != null || st.finalB != null ? ' open' : ''}><summary>選填：最後分數（填了會產生報分英文）</summary><div class="res-nums">${num('A')}${num('B')}<button class="pill" id="finClear">清空</button></div></details>
${warn}${st.result ? '<button class="linkbtn" id="resClear">取消選擇</button>' : '<div class="muted" style="font-size:13px">還沒選結果，下面不會出現勝隊或加賽話術。</div>'}</div>`;
}
function finalBodyHTML(st) {
  let h = liveLineHTML('gameend') + liveLineHTML('finalscore') + resultHTML(st);
  if (st.result === 'A' || st.result === 'B') {
    if (st.finalA != null && st.finalB != null) h += liveLineHTML('totals');
    h += liveLineHTML('winner');
  } else if (st.result === 'tie') {
    if (st.finalA != null && st.finalB != null) h += liveLineHTML('totals');
    h += `<div class="lv-h">加賽流程（最先完整答對的隊伍獲勝）</div>` + LIVE_TIE.map(k => liveLineHTML(k)).join('');
  }
  return h;
}
function moreKeys(st, shown) {
  const base = (CHEAT_TABS.find(t => t.name === st.sec) || { keys: [] }).keys.filter(k => !shown.has(k) && !(k.startsWith('round') && DYN_CHEAT[k]) && !(LINES[k] && LINES[k].practice) && !(st.sec === '09 最終' && ['winner', 'firstright', ...LIVE_TIE].includes(k)));
  const mine = base.filter(k => roleOk(k, DB.role));
  return mine.length ? mine : base; // 這段沒有自己角色的話術時，顯示全部
}
function renderLive() {
  LIVE_CTX = null;
  const st = lsGet(); const cfg = DB.liveCfg;
  if (!LV) LV = { overlay: null, open: new Set() };
  if (!LV.open) LV.open = new Set();
  const elec = cfg.scoreMode === 'elec';
  const secIdx = SECS.indexOf(st.sec);
  const inQ = Q_SECS.includes(st.sec);
  const card = cardOf(st); const n = nOf(st);
  const core = (DB.role === 'helper' && LIVE_CORE_HELPER[st.sec]) || LIVE_CORE[st.sec] || [];
  let body = ''; let shown = new Set(core);
  if (st.sec === '12 臨時狀況') body = emergencyGridHTML();
  else if (st.sec === '09 最終') { body = finalBodyHTML(st); shown = new Set([...core, 'totals']); }
  else if (st.view === 'flow' && FLOW_SECS.includes(st.sec)) { body = `<div class="lv-h">一題完整流程</div>` + LIVE_QFLOW.map(k => liveLineHTML(k)).join(''); shown = new Set(LIVE_QFLOW); }
  else body = core.map(k => liveLineHTML(k)).join('');
  const more = st.sec === '12 臨時狀況' ? [] : moreKeys(st, shown);
  const toolsOpen = LV.tools && LV.tools.q === qidOf(st) ? LV.tools.open : !n; // 還沒選題目時自動展開，選好後收起
  const tools = inQ ? `<details class="lv-tools"${toolsOpen ? ' open' : ''}><summary>題目：第 ${st.round} 回合第 ${st.q} 題｜${card ? esc(card.zh) + '・' : ''}${n ? n + ' 色' : '尚未選題卡'}</summary>
<div class="lv-ctrl">
<div class="lv-row"><span>回合</span>${[1, 2, 3].map(r => `<button class="lvb${st.round === r ? ' on' : ''}" data-round="${r}">${r}</button>`).join('')}<span style="margin-left:8px">題號</span>${[1, 2, 3].map(q => `<button class="lvb${st.q === q ? ' on' : ''}${st.scores[st.round + '-' + q] ? ' done' : ''}" data-q="${q}">${q}</button>`).join('')}</div>
<div class="lv-row wrap"><span>題卡</span>${CARDS.filter(c => c.round === String(st.round)).map(c => `<button class="lvb${st.card === c.code ? ' on' : ''}" data-card="${c.code}">${esc(c.zh)}</button>`).join('')}</div>
<div class="lv-row wrap"><span>只指定色數</span>${[2, 3, 4, 5, 6].map(x => `<button class="lvb${!st.card && st.ncolors === x ? ' on' : ''}" data-nc="${x}">${x} 色</button>`).join('')}</div>
${['05 觀察', '06 出題'].includes(st.sec) ? `<div class="lv-row"><span>計時（手動、靜音）</span><button class="lvb" data-timer="20">20 秒</button><button class="lvb" data-timer="10">10 秒</button><span id="lvT" class="lv-timer"></span></div>` : ''}
${FLOW_SECS.includes(st.sec) ? `<div class="lv-row"><span>顯示</span><button class="lvb${st.view !== 'flow' ? ' on' : ''}" data-view="sec">這一段</button><button class="lvb${st.view === 'flow' ? ' on' : ''}" data-view="flow">整題流程</button></div>` : ''}
</div></details>` : '';
  const score = st.sec === '08 計分' || (st.view === 'flow' && FLOW_SECS.includes(st.sec)) ? scoreHTML(st, n) : '';
  const qNav = FLOW_SECS.includes(st.sec) ? `<div class="lv-qnav">${st.q < 3 ? `<button class="btn pink" id="lvNextQ">下一題（第 ${st.q + 1} 題）→ 06 出題</button>` : st.round < 3 ? `<button class="btn pink" id="lvNextR">這回合結束 → 第 ${st.round + 1} 回合觀察</button>` : `<button class="btn pink" id="lvToFinal">第三回合結束 → 09 最終</button>`}</div>` : st.sec === '05 觀察' ? `<div class="lv-qnav"><button class="btn pink" id="lvToQ">觀察結束 → 06 出題（第 ${st.q} 題）</button></div>` : '';
  const t = liveTotals(st);
  const sub = inQ ? `第 ${st.round} 回合｜第 ${st.q} 題｜${n ? n + ' 色' : '未選題'}${card ? '｜' + esc(card.zh) : ''}${elec ? `｜A ${t.A}:${t.B} B` : ''}` : st.sec === '09 最終' ? (st.result ? (st.result === 'tie' ? '結果：平手' : `結果：${st.result} 隊獲勝`) : '尚未選結果') : '';
  app.innerHTML = `<div class="live fs-${cfg.font}${cfg.read === 'kw' ? ' kwmode' : ''}">
<div class="lv-top">
<button class="iconbtn" id="lvExit" aria-label="離開現場小抄">${ic('home')}</button>
<div class="lv-title"><b>${esc(st.sec)}</b>${sub ? `<small>${sub}</small>` : ''}</div>
<button class="lv-read" id="lvMode" aria-label="切換到主持速查">完整<small>流程</small></button>
<button class="lv-read" id="lvRead" aria-label="切換閱讀方式">${cfg.read === 'kw' ? '關鍵字' : '全文'}<small>閱讀方式</small></button>
<button class="lv-emg" id="lvEmg">臨時狀況</button>
</div>
<div class="lv-body">${tools}${body}${score}
${more.length ? `<details class="lv-more"${st.more ? ' open' : ''}><summary>展開更多話術（${more.length}）</summary>${more.map(k => liveLineHTML(k, { small: true, uid: 'm:' + k })).join('')}</details>` : ''}
${qNav}</div>
<nav class="lv-nav"><button id="lvPrev" ${secIdx <= 0 ? 'disabled' : ''} aria-label="上一段">‹ ${secIdx > 0 ? esc(SEC_SHORT(SECS[secIdx - 1])) : ''}</button><button id="lvMenu" class="mid">段落選單</button><button id="lvNext" ${secIdx >= 10 ? 'disabled' : ''} aria-label="下一段">${secIdx < 10 ? esc(SEC_SHORT(SECS[secIdx + 1])) : ''} ›</button></nav>
${LV.overlay ? overlayHTML() : ''}
</div>`;
  bindLive();
}
function scoreHTML(st, n) {
  const elec = DB.liveCfg.scoreMode === 'elec';
  const q = qidOf(st); const rec = st.scores[q];
  const pend = st.pend && st.pend.qid === q ? st.pend : null;
  const val = t => pend && pend[t] != null ? pend[t] : rec ? rec[t] : null;
  const step = t => `<div class="sc-team"><b>Team ${t}</b><div class="sc-step"><button class="lvb" data-sc="${t}" data-d="-1" aria-label="Team ${t} 減一" ${n ? '' : 'disabled'}>−</button><span class="en">${val(t) == null ? '–' : val(t)}</span><button class="lvb" data-sc="${t}" data-d="1" aria-label="Team ${t} 加一" ${n ? '' : 'disabled'}>＋</button></div><small>${n ? `本題最多 ${n} 分` : '先選題卡或色數'}</small></div>`;
  const tt = liveTotals(st);
  const list = Object.keys(st.scores).sort().map(k => { const r = st.scores[k]; const [rr, qq] = k.split('-'); return `<div class="sc-li"><span>第 ${rr} 回合第 ${qq} 題</span><b class="en">A ${r.A} : ${r.B} B</b><button class="pill" data-del="${k}" aria-label="刪除第 ${rr} 回合第 ${qq} 題的計分">刪除</button></div>`; }).join('');
  if (!elec) return `<details class="lv-score"${LV.scoreOpen ? ' open' : ''}><summary>選數字產生得分英文（紙本計分，不計總分）</summary>
<div class="sc-row">${step('A')}${step('B')}</div>
<div class="muted" style="font-size:12px">只用來產生上面的英文句子；分數請記在紙本計分板。要改用電子計分，到「段落選單」或開場設定切換。</div></details>`;
  return `<details class="lv-score"${LV.scoreOpen ? ' open' : ''}><summary>電子計分｜本題${rec ? `已計分 A ${rec.A}:${rec.B} B` : '未計分'}｜累計 A ${tt.A} : ${tt.B} B</summary>
<div class="sc-row">${step('A')}${step('B')}</div>
<div class="sc-acts"><button class="btn pink" id="scOk">${rec ? '更新這題得分' : '確認本題得分'}</button><button class="btn" id="scUndo" ${st.hist.length ? '' : 'disabled'}>復原上一步</button></div>
${list ? `<div class="sc-list"><b style="font-size:13px">已計分的題目（累計＝各題加總）</b>${list}</div>` : ''}
<div class="muted" style="font-size:12px">同一題重新確認只會更新那一題，不會重複加分。要改某題，切到那一題重新輸入，或刪除後重計。</div></details>`;
}
function emergencyGridHTML() {
  return `<div class="emg-grid">${EMERGENCY.map((e, i) => `<button class="emg-b" data-emg="${i}">${esc(e.label)}</button>`).join('')}</div>`;
}
function overlayHTML() {
  const cfg = DB.liveCfg;
  if (LV.overlay === 'nav') return `<div class="lv-ov" id="lvOv"><div class="lv-sheet"><div class="lv-sheet-h"><b>跳到段落</b><button class="iconbtn" id="ovClose" aria-label="關閉">✕</button></div>
<div class="nav-grid">${SECS.map(s => `<button class="navb${lsGet().sec === s ? ' on' : ''}" data-sec="${s}"><b>${s.slice(0, 2)}</b>${esc(SEC_SHORT(s))}</button>`).join('')}</div>
<button class="btn" id="ovFlow">一題完整流程（06→08）</button>
<div class="fgroup"><span>計分</span><button class="pill ovsm${cfg.scoreMode !== 'elec' ? ' on' : ''}" data-sm="paper">紙本／人工</button><button class="pill ovsm${cfg.scoreMode === 'elec' ? ' on' : ''}" data-sm="elec">電子計分</button></div>
<button class="btn" id="ovReset">下一組學生／重新開始</button></div></div>`;
  if (LV.overlay === 'emg') {
    if (LV.emg == null) return `<div class="lv-ov" id="lvOv"><div class="lv-sheet"><div class="lv-sheet-h"><b>臨時狀況</b><button class="iconbtn" id="ovClose" aria-label="關閉">✕</button></div>${emergencyGridHTML()}</div></div>`;
    const e = EMERGENCY[LV.emg];
    return `<div class="lv-ov" id="lvOv"><div class="lv-sheet"><div class="lv-sheet-h"><button class="iconbtn" id="ovBackE" aria-label="回到情境列表">${ic('back')}</button><b>${esc(e.label)}</b><button class="iconbtn" id="ovClose" aria-label="關閉">✕</button></div>${e.keys.map(k => liveLineHTML(k, { full: true })).join('')}<button class="btn pink" id="ovClose2" style="min-height:52px">回到剛才的流程</button></div></div>`;
  }
  return '';
}
function bindLive() {
  const st = lsGet(); const cfg = DB.liveCfg;
  const rr = () => { lsSave(); renderLive(); };
  const go = sec => { st.sec = sec; st.more = false; if (!FLOW_SECS.includes(sec)) st.view = 'sec'; checkPending(st); LV.overlay = null; rr(); window.scrollTo(0, 0); };
  $('#lvExit').onclick = () => { if (confirm('離開現場小抄？目前進度會保留，回來可以繼續。')) exitLive(); };
  $('#lvEmg').onclick = () => { LV.overlay = 'emg'; LV.emg = null; renderLive(); };
  $('#lvMode').onclick = () => { cfg.mode = 'quick'; save(); LV.overlay = null; renderQuick(); window.scrollTo(0, 0); };
  $('#lvRead').onclick = () => { cfg.read = cfg.read === 'kw' ? 'full' : 'kw'; LV.open = new Set(); const y = window.scrollY; rr(); window.scrollTo(0, y); };
  $('#lvMenu').onclick = () => { LV.overlay = 'nav'; renderLive(); };
  $('#lvPrev').onclick = () => { const i = SECS.indexOf(st.sec); if (i > 0) go(SECS[i - 1]); };
  $('#lvNext').onclick = () => { const i = SECS.indexOf(st.sec); if (i < 10) go(SECS[i + 1]); };
  document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { const u = b.dataset.open; if (LV.open.has(u)) LV.open.delete(u); else LV.open.add(u); const y = window.scrollY; renderLive(); window.scrollTo(0, y); });
  const lt = $('.lv-tools'); if (lt) lt.ontoggle = e => { LV.tools = { q: qidOf(st), open: e.target.open }; };
  document.querySelectorAll('[data-round]').forEach(b => b.onclick = () => { st.round = +b.dataset.round; const rec = st.scores[qidOf(st)]; st.card = rec ? rec.card || null : null; st.ncolors = rec ? rec.nc || null : null; checkPending(st); rr(); });
  document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { st.q = +b.dataset.q; const rec = st.scores[qidOf(st)]; st.card = rec ? rec.card || null : null; st.ncolors = rec ? rec.nc || null : null; checkPending(st); rr(); });
  document.querySelectorAll('[data-card]').forEach(b => b.onclick = () => { LV.tools = null; st.card = st.card === b.dataset.card ? null : b.dataset.card; checkPending(st); rr(); });
  document.querySelectorAll('[data-nc]').forEach(b => b.onclick = () => { LV.tools = null; st.card = null; st.ncolors = +b.dataset.nc; checkPending(st); rr(); });
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { st.view = b.dataset.view; rr(); });
  document.querySelectorAll('[data-tw]').forEach(b => b.onclick = () => { st.tieWinner = st.tieWinner === b.dataset.tw ? null : b.dataset.tw; rr(); });
  document.querySelectorAll('[data-timer]').forEach(b => b.onclick = () => startLiveTimer(+b.dataset.timer));
  const mo = $('.lv-more'); if (mo) mo.ontoggle = e => { st.more = e.target.open; lsSave(); };
  const sc = $('.lv-score'); if (sc) sc.ontoggle = e => { LV.scoreOpen = e.target.open; };
  document.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => { setPend(st, b.dataset.sc, +b.dataset.d); rr(); });
  if ($('#scOk')) $('#scOk').onclick = () => { const r = confirmScore(st); if (r === 'ok') { rr(); toast('已記錄本題得分'); } else if (r) toast(r); };
  if ($('#scUndo')) $('#scUndo').onclick = () => { const h = st.hist.pop(); if (h == null) return; st.scores = JSON.parse(h); st.pend = null; rr(); toast('已復原上一步'); };
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { if (!confirm('刪除這一題的計分？')) return; st.hist.push(JSON.stringify(st.scores)); delete st.scores[b.dataset.del]; rr(); });
  // 最終結果
  document.querySelectorAll('[data-res]').forEach(b => b.onclick = () => { st.result = b.dataset.res; if (st.result !== 'tie') st.tieWinner = null; rr(); });
  if ($('#resClear')) $('#resClear').onclick = () => { st.result = null; st.tieWinner = null; rr(); };
  if ($('#resSug')) $('#resSug').onclick = () => { const t = liveTotals(st); st.result = t.A > t.B ? 'A' : t.B > t.A ? 'B' : 'tie'; st.finalA = t.A; st.finalB = t.B; if (st.result !== 'tie') st.tieWinner = null; rr(); };
  ['A', 'B'].forEach(t => { const el = $('#fin' + t); if (el) el.onchange = () => { const v = el.value.trim(); if (v === '') st['final' + t] = null; else { const x = Number(v); if (!isInt(x)) { toast('請輸入 0 以上的整數'); el.value = st['final' + t] ?? ''; return; } st['final' + t] = x; } setTimeout(() => { const y = window.scrollY; rr(); window.scrollTo(0, y); }, 0); }; });
  if ($('#finClear')) $('#finClear').onclick = () => { st.finalA = st.finalB = null; rr(); };
  if ($('#lvNextQ')) $('#lvNextQ').onclick = () => { st.q += 1; st.card = null; st.ncolors = null; go('06 出題'); };
  if ($('#lvNextR')) $('#lvNextR').onclick = () => { st.round += 1; st.q = 1; st.card = null; st.ncolors = null; go('05 觀察'); };
  if ($('#lvToFinal')) $('#lvToFinal').onclick = () => go('09 最終');
  if ($('#lvToQ')) $('#lvToQ').onclick = () => go('06 出題');
  document.querySelectorAll('.lv-body [data-emg]').forEach(b => b.onclick = () => { LV.overlay = 'emg'; LV.emg = +b.dataset.emg; renderLive(); });
  if ($('#lvOv')) {
    $('#lvOv').onclick = e => { if (e.target.id === 'lvOv') { LV.overlay = null; renderLive(); } };
    document.querySelectorAll('#ovClose,#ovClose2').forEach(b => b.onclick = () => { LV.overlay = null; LV.emg = null; renderLive(); });
    if ($('#ovBackE')) $('#ovBackE').onclick = () => { LV.emg = null; renderLive(); };
    document.querySelectorAll('.lv-sheet [data-emg]').forEach(b => b.onclick = () => { LV.emg = +b.dataset.emg; renderLive(); });
    document.querySelectorAll('.navb').forEach(b => b.onclick = () => go(b.dataset.sec));
    document.querySelectorAll('.ovsm').forEach(b => b.onclick = () => { cfg.scoreMode = b.dataset.sm; save(); renderLive(); });
    if ($('#ovFlow')) $('#ovFlow').onclick = () => { st.view = 'flow'; go('06 出題'); };
    if ($('#ovReset')) $('#ovReset').onclick = () => { if (confirm('開始下一組學生？會清除這一組的回合、題號、計分和勝負結果。字體、角色和練習紀錄都會保留。')) { DB.liveState = Object.assign(LS_DEFAULT(), { started: true }); save(); LV.overlay = null; LV.open = new Set(); renderLive(); window.scrollTo(0, 0); } };
  }
  updateTimerLabel();
}
/* =========================================================
   主持速查（V5.2，預設）：只查英文，不需要設定、計分或計時
   ========================================================= */
function openLive() {
  if (DB.liveCfg.mode === 'flow') { const st = lsGet(); if (st.started) enterLive(); else renderLiveEntry(); return; }
  LV = { overlay: null, open: new Set() };
  document.body.classList.add('live-mode');
  requestWake();
  renderQuick(); window.scrollTo(0, 0);
}
function quickCtx() {
  const q = DB.quickState;
  return Object.assign(LS_DEFAULT(), { quick: true, sec: q.sec, round: q.round || 1, q: 2, ncolors: q.nc, result: q.result, tieWinner: q.tw });
}
const QSEC_LABEL = s => s === '12 臨時狀況' ? '應變' : SEC_SHORT(s);
function renderQuick() {
  const q = DB.quickState; const cfg = DB.liveCfg;
  if (!LV) LV = { overlay: null, open: new Set() };
  if (!LV.open) LV.open = new Set();
  LIVE_CTX = quickCtx();
  const sec = q.sec;
  const line = k => { const h = liveLineHTML(k, { uid: 'q:' + k }); const du = (LINES[k] || DYN_CHEAT[k] || {}).duty; return du === 'host2' || du === 'helper' ? h.replace(/^<(div|button) class="lv-line/, `<$1 data-duty="${DUTY_ZH[du]}" class="lv-line duty`) : h; };
  let tools = '', body = '';
  if (sec === '05 觀察') tools = `<div class="qk-chips"><span>回合</span>${[1, 2, 3].map(r => `<button class="lvb${q.round === r ? ' on' : ''}" data-qround="${r}">${r}</button>`).join('')}</div>`;
  if (['06 出題', '12 臨時狀況'].includes(sec)) tools = `<div class="qk-chips"><span>這題幾色</span>${[2, 3, 4, 5, 6].map(n => `<button class="lvb${q.nc === n ? ' on' : ''}" data-qnc="${n}">${n}</button>`).join('')}<button class="lvb${q.nc ? '' : ' on'}" data-qnc="0">不指定</button></div>`;
  if (sec === '12 臨時狀況') body = emergencyGridHTML();
  else if (sec === '09 最終') {
    const b = (v, l) => `<button class="lvb res${q.result === v ? ' on' : ''}" data-qres="${v}">${l}</button>`;
    body = QUICK_HOST[sec].map(line).join('') + `<div class="lv-result"><b>最後結果（看計分板後點選）</b><div class="res-btns">${b('A', 'A 隊獲勝')}${b('B', 'B 隊獲勝')}${b('tie', '兩隊平手')}</div>${q.result ? '' : '<div class="muted" style="font-size:13px">點選後才會出現宣布結果的英文。</div>'}</div>`;
    if (q.result === 'A' || q.result === 'B') body += line('winner');
    if (q.result === 'tie') body += `<div class="lv-h">加賽（用第三回合沒抽到的題卡；最先完整答對的隊伍獲勝）</div>` + QUICK_TIE.map(line).join('');
  } else body = (QUICK_HOST[sec] || []).map(line).join('');
  const i = SECS.indexOf(sec);
  app.innerHTML = `<div class="live quick fs-${cfg.font}${cfg.read === 'kw' ? ' kwmode' : ''}">
<div class="qk-head">
<div class="lv-top qk-top">
<button class="iconbtn" id="qkExit" aria-label="回首頁">${ic('home')}</button>
<div class="lv-title"><b>主持速查</b><small>${esc(sec)}</small></div>
<button class="lv-read" id="qkMode" aria-label="切換到完整流程">速查<small>切換</small></button>
<button class="lv-read" id="qkRead" aria-label="切換閱讀方式">${cfg.read === 'kw' ? '關鍵字' : '全文'}<small>閱讀方式</small></button>
<button class="lv-emg" id="qkEmg">臨時狀況</button>
</div>
<nav class="qk-secs" aria-label="段落">${SECS.map(s => `<button class="qk-sec${s === sec ? ' on' : ''}${s === '12 臨時狀況' ? ' emg' : ''}" data-qsec="${s}" aria-current="${s === sec}"><b>${s.slice(0, 2)}</b>${esc(QSEC_LABEL(s))}</button>`).join('')}</nav>
</div>
<div class="lv-body qk-body">${tools}${body}
${i < 11 ? `<button class="btn qk-next" data-qsec="${SECS[i + 1]}">下一段：${esc(SECS[i + 1])} ›</button>` : ''}</div>
${LV.overlay === 'emg' ? overlayHTML() : ''}
</div>`;
  bindQuick();
}
function bindQuick() {
  const q = DB.quickState; const cfg = DB.liveCfg;
  const rq = (top) => { save(); const y = window.scrollY; renderQuick(); window.scrollTo(0, top ? 0 : y); };
  $('#qkExit').onclick = () => { LIVE_CTX = null; exitLive(); };
  $('#qkMode').onclick = () => { cfg.mode = 'flow'; save(); LIVE_CTX = null; LV = null; const st = lsGet(); if (st.started) enterLive(); else { document.body.classList.remove('live-mode'); renderLiveEntry(); } };
  $('#qkRead').onclick = () => { cfg.read = cfg.read === 'kw' ? 'full' : 'kw'; LV.open = new Set(); rq(); };
  $('#qkEmg').onclick = () => { LV.overlay = 'emg'; LV.emg = null; renderQuick(); };
  document.querySelectorAll('[data-qsec]').forEach(b => b.onclick = () => { q.sec = b.dataset.qsec; LV.open = new Set(); rq(true); });
  document.querySelectorAll('[data-qround]').forEach(b => b.onclick = () => { q.round = +b.dataset.qround; rq(); });
  document.querySelectorAll('[data-qnc]').forEach(b => b.onclick = () => { q.nc = +b.dataset.qnc || null; rq(); });
  document.querySelectorAll('[data-qres]').forEach(b => b.onclick = () => { q.result = q.result === b.dataset.qres ? null : b.dataset.qres; if (q.result !== 'tie') q.tw = null; rq(); });
  document.querySelectorAll('[data-tw]').forEach(b => b.onclick = () => { q.tw = q.tw === b.dataset.tw ? null : b.dataset.tw; rq(); });
  document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { const u = b.dataset.open; if (LV.open.has(u)) LV.open.delete(u); else LV.open.add(u); const y = window.scrollY; renderQuick(); window.scrollTo(0, y); });
  document.querySelectorAll('.lv-body [data-emg]').forEach(b => b.onclick = () => { LV.overlay = 'emg'; LV.emg = +b.dataset.emg; renderQuick(); });
  if ($('#lvOv')) {
    $('#lvOv').onclick = e => { if (e.target.id === 'lvOv') { LV.overlay = null; renderQuick(); } };
    document.querySelectorAll('#ovClose,#ovClose2').forEach(b => b.onclick = () => { LV.overlay = null; LV.emg = null; renderQuick(); });
    if ($('#ovBackE')) $('#ovBackE').onclick = () => { LV.emg = null; renderQuick(); };
    document.querySelectorAll('.lv-sheet [data-emg]').forEach(b => b.onclick = () => { LV.emg = +b.dataset.emg; renderQuick(); });
  }
}

let lvEnd = 0;
function startLiveTimer(sec) {
  if (lvTimer) { clearInterval(lvTimer); lvTimer = null; if (lvEnd && $('#lvT')) { lvEnd = 0; $('#lvT').textContent = '已停止'; return; } }
  lvEnd = Date.now() + sec * 1000;
  lvTimer = setInterval(updateTimerLabel, 250); updateTimerLabel();
}
function updateTimerLabel() {
  const el = $('#lvT'); if (!el || !lvEnd) return;
  const left = Math.ceil((lvEnd - Date.now()) / 1000);
  if (left <= 0) { el.textContent = '時間到'; el.classList.add('done'); clearInterval(lvTimer); lvTimer = null; lvEnd = 0; return; }
  el.classList.remove('done'); el.textContent = `${left} 秒（再按一次停止）`;
}

/* =========================================================
   練習紀錄、貼紙
   ========================================================= */
function renderRecords() {
  window.__rerender = null;
  const keys = allKeys();
  const practiced = keys.filter(k => DB.cards[k] && DB.cards[k].n > 0);
  const good = keys.filter(k => levelOf(k) === 'good');
  const weak = weakKeysAll('all');
  const bySec = SECS.map(s => { const ks = keys.filter(k => secOf(k) === s); return { s, total: ks.length, good: ks.filter(k => levelOf(k) === 'good').length, shaky: ks.filter(k => levelOf(k) === 'shaky').length, bad: ks.filter(k => levelOf(k) === 'bad').length }; });
  const logs = DB.cardLog.slice(-8).reverse();
  const sims = [...(DB.history.host || []).map(h => ({ ...h, role: '關主' })), ...(DB.history.helper || []).map(h => ({ ...h, role: '小幫手' }))].sort((a, b) => b.t - a.t).slice(0, 6);
  const d = t => { const x = new Date(t); return `${x.getMonth() + 1}/${x.getDate()} ${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`; };
  app.innerHTML = `<div class="report">
<div class="topbar"><div class="l"><button class="iconbtn" id="rcBack" aria-label="回首頁">${ic('back')}</button><h2>練習紀錄</h2></div></div>
<h3>快速複習（自評）</h3>
<div class="stats"><div class="stat"><b>${practiced.length}</b><small>已練習</small></div><div class="stat"><b>${keys.length - practiced.length}</b><small>尚未練習</small></div><div class="stat"><b>${good.length}</b><small>熟練</small></div><div class="stat"><b>${weak.length}</b><small>待加強</small></div><div class="stat"><b>${DB.fav.length}</b><small>收藏</small></div></div>
<div class="card" style="display:flex;flex-direction:column;gap:8px"><b style="font-size:14px">各段落熟練情形</b>
${bySec.map(x => `<div class="secbar"><span>${x.s}</span><div class="sb" role="img" aria-label="${x.s}：熟練 ${x.good}、有點卡 ${x.shaky}、不熟 ${x.bad}、共 ${x.total}"><i class="g" style="width:${x.good / x.total * 100}%"></i><i class="s" style="width:${x.shaky / x.total * 100}%"></i><i class="b" style="width:${x.bad / x.total * 100}%"></i></div><small>${x.good}/${x.total}</small></div>`).join('')}
<div class="muted" style="font-size:12px">綠：熟練　黃：有點卡　粉：不熟　灰：尚未練習</div></div>
<h3>最近的快速複習</h3>
${logs.length ? logs.map(l => `<div class="ci" style="flex-direction:row;justify-content:space-between;align-items:center"><span>${d(l.t)}</span><span class="muted" style="font-size:13px">${l.n} 句｜順 ${l.good}・卡 ${l.shaky}・不熟 ${l.bad}</span></div>`).join('') : '<div class="ci muted">還沒有紀錄</div>'}
<h3>情境模擬（和參考話術的相似度）</h3>
${sims.length ? sims.map(h => `<div class="ci" style="flex-direction:row;justify-content:space-between;align-items:center"><span>${d(h.t)}｜${h.role}</span><span class="muted" style="font-size:13px">${h.n} 題｜好感度 ${h.hearts}/10｜相似度達標 ${h.acc}%</span></div>`).join('') : '<div class="ci muted">還沒有紀錄</div>'}
<div class="ci" style="flex-direction:row;justify-content:space-between;align-items:center"><span>貼紙</span><b>${DB.stickers.length} / 9</b></div>
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#rcBack').onclick = renderStart;
  window.scrollTo(0, 0);
}
function renderStickers() {
  app.innerHTML = `<div class="report">
<div class="topbar"><div class="l"><button class="iconbtn" id="skBack" aria-label="回首頁">${ic('back')}</button><h2>貼紙收藏 ${DB.stickers.length} / 9</h2></div></div>
<div class="stkgrid">${ALL_ANIMALS.map(a => { const on = DB.stickers.includes(a); return `<div class="stk${on ? '' : ' off'}"><img src="${IMG(a + (on ? '-happy' : '-n'))}" alt="${on ? ZH_NAME[a] : '未收集'}"><span>${on ? ZH_NAME[a] : '？？？'}</span></div>`; }).join('')}</div>
<div class="card" style="font-size:14px;line-height:1.7">怎麼拿貼紙：<br>・快速複習一輪練到 10 句以上（同一輪重複出現的卡不重複計算）<br>・進階情境模擬一輪 8 題以上、好感度 6 顆心以上</div>
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#skBack').onclick = renderStart;
  window.scrollTo(0, 0);
}

/* =========================================================
   設定
   ========================================================= */
function renderSettings() {
  window.__rerender = renderSettings;
  const sw = (id, on, label, desc) => `<label class="setrow"><span><b>${label}</b>${desc ? `<small>${desc}</small>` : ''}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}></label>`;
  const seg = (g, v, l, obj) => `<button class="pill cset${String(obj[g]) === String(v) ? ' on' : ''}" data-obj="${obj === DB ? 'db' : 'live'}" data-g="${g}" data-v="${v}">${l}</button>`;
  app.innerHTML = `<div class="start">
<div class="topbar"><div class="l"><button class="iconbtn" id="stBack" aria-label="回首頁">${ic('back')}</button><h2>設定</h2></div></div>
<div class="card setcard"><b>練習</b>
<div class="fgroup"><span>預設角色</span>${seg('role', 'host', '關主', DB)}${seg('role', 'helper', '小幫手', DB)}</div>
${sw('stSpeak', DB.autoSpeak, '翻卡／答完自動朗讀', '現場小抄一律不會自動播放')}
<label class="setrow"><span><b>英文朗讀速度</b><small id="rateV">${DB.speechRate.toFixed(2)} 倍</small></span><input type="range" id="stRate" min="0.6" max="1.2" step="0.05" value="${DB.speechRate}"></label>
<button class="btn" id="stTry">${ic('sound')}試聽</button></div>
<div class="card setcard"><b>麥克風（進階情境模擬用）</b>
<div id="mictest" style="font-size:14px;line-height:1.6">${DB.micMode === 'web' ? '網頁麥克風可以用。' : DB.micMode === 'keyboard' ? '目前是鍵盤聽寫模式。' : '尚未測試。'}</div>
<div style="display:flex;gap:8px"><button class="btn" id="mt" style="flex:1">${ic('mic')}麥克風測試</button>${DB.micMode === 'keyboard' ? '<button class="btn" id="stWeb" style="flex:1">改回網頁麥克風</button>' : '<button class="btn" id="kb" style="flex:1">改用鍵盤聽寫</button>'}</div>
${sw('stGram', DB.grammarOn, '答完檢查文法（預設關閉）', '開啟後，你在情境模擬輸入的英文會送到外部服務 LanguageTool 檢查，需要網路。')}</div>
<div class="card setcard"><b>現場小抄</b>
<div class="fgroup"><span>字體</span>${seg('font', 'm', '大', DB.liveCfg)}${seg('font', 'l', '特大', DB.liveCfg)}${seg('font', 'xl', '超大', DB.liveCfg)}</div>
<div class="fgroup"><span>中文</span>${seg('zh', true, '顯示', DB.liveCfg)}${seg('zh', false, '隱藏', DB.liveCfg)}</div>
${sw('stWake', DB.liveCfg.wake, '現場模式防止螢幕休眠', 'wakeLock' in navigator ? '這個瀏覽器支援，進入現場小抄時啟用。' : '⚠ 這個瀏覽器不支援防休眠，請到手機設定暫時延長自動鎖定時間。')}</div>
<div class="card setcard"><b>練習紀錄</b>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="stExp">匯出 JSON</button><button class="btn" id="stImp">匯入 JSON</button><input type="file" id="stFile" accept="application/json,.json" class="sr"></div>
<div id="impBox"></div>
<button class="btn" id="stClear" style="color:#B23A55">清除練習紀錄</button></div>
<div class="card setcard"><b>關於</b><div style="font-size:14px">版本 V${APP_VERSION}</div><div class="offline" id="offline"></div></div>
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#stBack').onclick = renderStart;
  document.querySelectorAll('.cset').forEach(b => b.onclick = () => { const o = b.dataset.obj === 'db' ? DB : DB.liveCfg; const v = b.dataset.v; o[b.dataset.g] = v === 'true' ? true : v === 'false' ? false : v; if (b.dataset.g === 'role') ROLE = DB.role; save(); const y = window.scrollY; renderSettings(); window.scrollTo(0, y); });
  $('#stSpeak').onchange = e => { DB.autoSpeak = e.target.checked; save(); };
  $('#stRate').oninput = e => { DB.speechRate = +e.target.value; $('#rateV').textContent = DB.speechRate.toFixed(2) + ' 倍'; save(); };
  $('#stTry').onclick = () => speak("Ready? Set, go!");
  $('#mt').onclick = micTest;
  if ($('#kb')) $('#kb').onclick = () => setKeyboardMode('manual');
  if ($('#stWeb')) $('#stWeb').onclick = () => { DB.micMode = null; S.srBlocked = false; save(); renderSettings(); };
  $('#stGram').onchange = e => { if (e.target.checked && !confirm('開啟後，你在情境模擬輸入的英文句子會傳送到外部服務 LanguageTool 做文法檢查。確定開啟？')) { e.target.checked = false; return; } DB.grammarOn = e.target.checked; save(); };
  $('#stWake').onchange = e => { DB.liveCfg.wake = e.target.checked; save(); };
  $('#stExp').onclick = exportData;
  $('#stImp').onclick = () => $('#stFile').click();
  $('#stFile').onchange = e => importData(e.target.files[0]);
  $('#stClear').onclick = () => {
    if (!confirm('確定要清除練習紀錄嗎？（熟練度、收藏、待加強、模擬紀錄、貼紙都會清除）')) return;
    if (!confirm('再確認一次：清除後無法復原。建議先按「匯出 JSON」備份。真的要清除？')) return;
    const keep = { autoSpeak: DB.autoSpeak, speechRate: DB.speechRate, micMode: DB.micMode, role: DB.role, liveCfg: DB.liveCfg, review: DB.review, schemaVersion: 5, grammarOn: DB.grammarOn };
    DB = Object.assign({ history: { host: [], helper: [] }, stats: {}, stickers: [], cards: {}, fav: [], weakManual: [], custom: [], cardLog: [] }, keep);
    save(); toast('紀錄已清除'); renderSettings();
  };
  showOfflineStatus($('#offline'));
  window.scrollTo(0, 0);
}
function exportData() {
  const blob = new Blob([JSON.stringify({ app: 'host-sim', appVersion: APP_VERSION, schemaVersion: DB.schemaVersion, exportedAt: new Date().toISOString(), data: DB }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `關主英文助手_練習紀錄_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  toast('已匯出練習紀錄');
}
const SCHEMA_MIN = 1, SCHEMA_MAX = 5;
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const isNum = v => typeof v === 'number' && isFinite(v) && v >= 0;
const strArr = v => Array.isArray(v) && v.every(x => typeof x === 'string');
/* 匯入檔驗證：回傳錯誤訊息字串；沒問題回傳 null */
function validateImport(obj) {
  if (!isObj(obj) || obj.app !== 'host-sim' || !isObj(obj.data)) return '檔案格式不符（不是關主英文助手匯出的紀錄）';
  const d = obj.data;
  const ver = obj.schemaVersion ?? d.schemaVersion ?? 1;
  if (!Number.isInteger(ver)) return '紀錄的版本號碼不正確';
  if (ver > SCHEMA_MAX) return `這是較新版本（資料版本 ${ver}）匯出的紀錄，目前網站只支援到版本 ${SCHEMA_MAX}。請先更新網站再匯入`;
  if (ver < SCHEMA_MIN) return `不支援的資料版本 ${ver}`;
  if (!isObj(d.cards)) return '熟練度資料（cards）格式錯誤';
  for (const [k, c] of Object.entries(d.cards)) {
    if (!isObj(c)) return `熟練度資料「${k}」格式錯誤`;
    for (const f of ['n', 'streak', 'badN', 'last', 'lastBad']) if (c[f] != null && !isNum(c[f])) return `熟練度資料「${k}」的 ${f} 不是數字`;
    if (c.level != null && !['bad', 'shaky', 'good'].includes(c.level)) return `熟練度資料「${k}」的等級不正確`;
  }
  if (!isObj(d.history) || !['host', 'helper'].every(r => d.history[r] == null || (Array.isArray(d.history[r]) && d.history[r].every(h => isObj(h) && isNum(h.t))))) return '模擬紀錄（history）格式錯誤';
  if (d.stats != null) { if (!isObj(d.stats)) return '模擬統計（stats）格式錯誤'; for (const v of Object.values(d.stats)) if (!isObj(v) || !isNum(v.n) || !isNum(v.ok) || !isNum(v.hint)) return '模擬統計（stats）格式錯誤'; }
  for (const f of ['fav', 'weakManual', 'stickers']) if (d[f] != null && !strArr(d[f])) return `${f} 格式錯誤（應為文字清單）`;
  if (d.stickers && d.stickers.some(x => !ALL_ANIMALS.includes(x))) return '貼紙資料裡有不認得的貼紙';
  if (d.custom != null && !(Array.isArray(d.custom) && d.custom.every(c => isObj(c) && typeof c.key === 'string' && typeof c.en === 'string' && c.en.trim()))) return '自訂句子（custom）格式錯誤';
  if (d.cardLog != null && !(Array.isArray(d.cardLog) && d.cardLog.every(l => isObj(l) && isNum(l.t)))) return '複習紀錄（cardLog）格式錯誤';
  return null;
}
function importMerge(d) {
  for (const [k, c] of Object.entries(d.cards || {})) { const cur = DB.cards[k]; if (!cur || (c.last || 0) > (cur.last || 0)) DB.cards[k] = c; }
  DB.fav = [...new Set([...DB.fav, ...(d.fav || [])])];
  DB.weakManual = [...new Set([...DB.weakManual, ...(d.weakManual || [])])];
  DB.stickers = [...new Set([...DB.stickers, ...(d.stickers || [])])];
  for (const c of d.custom || []) if (!DB.custom.find(x => x.key === c.key)) DB.custom.push(c);
  for (const [k, v] of Object.entries(d.stats || {})) { const cur = DB.stats[k]; DB.stats[k] = cur ? { n: Math.max(cur.n, v.n), ok: Math.max(cur.ok, v.ok), hint: Math.max(cur.hint, v.hint) } : v; }
  for (const r2 of ['host', 'helper']) { const seen = new Set((DB.history[r2] || []).map(h => h.t)); DB.history[r2] = [...(DB.history[r2] || []), ...((d.history || {})[r2] || []).filter(h => !seen.has(h.t))].sort((a, b) => a.t - b.t).slice(-30); }
  const seenL = new Set(DB.cardLog.map(l => l.t)); DB.cardLog = [...DB.cardLog, ...(d.cardLog || []).filter(l => !seenL.has(l.t))].sort((a, b) => a.t - b.t).slice(-60);
}
function importData(file) {
  if (!file) return;
  const box = $('#impBox');
  const fail = msg => { box.innerHTML = `<div class="ci imp-err" style="margin-top:8px">✕ ${esc(msg)}<br><small>原本的紀錄沒有變動。</small></div>`; toast('匯入失敗，原本紀錄沒有變動'); };
  if (file.size > 5 * 1024 * 1024) { fail('檔案太大（超過 5 MB），不像是練習紀錄'); return; }
  const r = new FileReader();
  r.onload = () => {
    let obj;
    try { obj = JSON.parse(r.result); } catch (e) { fail('這個檔案不是正確的 JSON（可能損壞或不完整）'); return; }
    const err = validateImport(obj); if (err) { fail(err); return; }
    const d = obj.data; const ver = obj.schemaVersion ?? d.schemaVersion ?? 1;
    box.innerHTML = `<div class="ci" style="margin-top:8px"><b>要匯入的紀錄</b><span style="font-size:13px">資料版本 ${ver}｜熟練度 ${Object.keys(d.cards).length} 句｜收藏 ${(d.fav || []).length}｜貼紙 ${(d.stickers || []).length}</span>
<span class="muted" style="font-size:12px">匯入前會自動備份目前的紀錄。</span>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn mint" id="impMerge">合併</button><button class="btn" id="impOver">覆蓋</button><button class="btn" id="impCancel">取消</button></div></div>`;
    $('#impCancel').onclick = () => { box.innerHTML = ''; };
    const run = (fn) => {
      const backup = JSON.stringify(DB);
      try { localStorage.setItem(KEY + '-backup-before-import', backup); } catch (e) { fail('無法先備份目前紀錄（儲存空間不足），所以沒有匯入'); return false; }
      try { fn(); save(); if (localStorage.getItem(KEY) == null) throw new Error('save failed'); return true; }
      catch (e) { DB = JSON.parse(backup); try { localStorage.setItem(KEY, backup); } catch (e2) { /* ignore */ } fail('匯入過程出錯，已還原原本紀錄'); return false; }
    };
    $('#impOver').onclick = () => {
      if (!confirm('覆蓋會用檔案內容取代目前的紀錄（目前紀錄會先備份），確定？')) return;
      if (run(() => { DB = JSON.parse(JSON.stringify(d)); DB.schemaVersion = ver; })) { toast('已覆蓋匯入，重新載入中'); setTimeout(() => location.reload(), 400); }
    };
    $('#impMerge').onclick = () => { if (run(() => importMerge(d))) { toast('已合併匯入'); renderSettings(); } };
  };
  r.onerror = () => fail('讀取檔案失敗');
  r.readAsText(file);
}

/* =========================================================
   AI 口語陪練（只提供可複製的指令，不串接 API）
   ========================================================= */
const RULES_SUMMARY = `Background (the real event — please follow it exactly):
- Event: "Brand Color Challenge" game station, December 17, 2026, at Zhongli Commercial High School in Taiwan.
- Visitors: 8–9 students from Kumamoto Kita High School (Kumamoto Prefecture, Japan) per group. Team A has 4 students, Team B has 4 or 5. Five groups in total.
- Each group has 15 minutes: about 12 minutes of game time, then 3 minutes to reset.
- Staff: Host 1 (me) speaks English and runs the game (welcome, teams, rules, warm-up, color board, black-and-white cards, number of colors, "Ready? Set, go!", revealing answers, short brand introductions, prizes, goodbye, students' questions). Host 2 keeps time, checks the raised wristbands, records and announces scores, confirms the winner and helps with the tie-breaker. Two helpers put on wristbands, check that each team has all eight colors, hand out prizes and collect wristbands.
- Wristbands: exactly eight colors — red, white, black, blue, green, orange, yellow, brown. Each team has all eight, each color once. Students follow a fixed color card (they do not choose colors). Each student wears one or two wristbands, at most one on each wrist.
${[4, 5].map(n => `  ${n}-person team: ` + BAND_CARDS[n].map((b, i) => `student ${i + 1} = ${[...b].map(k => COLORS[k].en).join(' + ')}`).join('; ')).join('\n')}
- Warm-up: one of two cards (no points). Then 3 rounds. In each round, 3 of 4 cards are used (9 scored questions).
- Each round starts with ONE look at the color logo board for 20 seconds (only once per round, not before every question).
- For each question I show a black-and-white logo and say how many colors it has. Each team can raise up to that many hands (fewer is OK). White counts as a color. 10 seconds to answer. I start with "Ready? Set, go!" Students keep their hands up until scoring is done.
- One point per correct color. No points off for wrong answers. The team with more points after 9 questions wins.
- Tie: one more question using the round-3 card that was not used. The first team to get all the colors right wins.
- Prizes: everyone gets a pencil case. The winning team's pencil cases also have OVAL correction tape inside; the tape color is random, like a blind box.
- Official cards and answers (there is NO FamilyMart card; round 2 uses 7-ELEVEN):
${CARDS.map(c => `  ${c.code === 'W-1' || c.code === 'W-2' ? 'Warm-up' : 'Round ' + c.round} ${c.code} ${c.say === 'our school logo' ? 'Zhongli Commercial High School (our school logo)' : c.say}: ${c.colors.length} colors — ${listColors(c.colors)}`).join('\n')}
- When you play the students, decide who raises a hand based on the wristbands above (for example, only the student wearing yellow can raise a yellow wristband). Never give impossible answers such as colors outside the eight wristband colors.
- Act as friendly, slightly shy Japanese high school students using simple English. Always wait for me to speak before you respond; don't play the whole game by yourself.`;
const AI_MODES = [
  { id: 'teach', name: '教學模式', desc: '邊玩邊即時修正', text: `Please role-play as friendly, slightly shy Japanese high school students joining my game station "Brand Color Challenge". I am Host 1. Use simple English. Wait for me to finish each time before you respond, and don't play the whole game by yourself. If my English is unnatural or has a grammar mistake, first give me a more natural version in English and a one-sentence explanation in Traditional Chinese, then continue as the students. Don't correct sentences that are already fine.` },
  { id: 'fluency', name: '流暢度模式', desc: '從開場到道別一次跑完', text: `Please role-play as Japanese high school students and go through the whole "Brand Color Challenge" with me, from the opening to the goodbye. Don't keep stopping to correct my grammar unless my instruction is hard to understand. When we finish (or when I say "stop"), summarize my main problems and suggest sentences to practice, in Traditional Chinese.` },
  { id: 'trouble', name: '突發狀況模式', desc: '隨機出狀況讓你應變', text: `Please role-play as Japanese high school students joining "Brand Color Challenge". Randomly create small problems or questions, for example: not understanding the rules, raising too many hands, asking for more time, a wristband falling off, questioning the score, or asking about the gift. Only one situation at a time. Wait for me to respond in English, then give a short correction (natural English + one sentence in Traditional Chinese) and move to the next situation.` },
  { id: 'weak', name: '弱點複習模式', desc: '針對你不熟的句子設計情境', text: `Based on the English host lines I'm not familiar with (listed below), please design short student-interaction situations from "Brand Color Challenge" so that I can say the right English myself. Don't show the answer first. Only one situation at a time. After I answer, give a short correction (natural English + one sentence in Traditional Chinese).` },
];
let AIW = { withWeak: true };
function aiPrompt(m) {
  let t = m.text + '\n\n' + RULES_SUMMARY;
  if (m.id === 'weak') {
    const ks = weakKeysAll(DB.role);
    t += '\n\nLines I\'m not familiar with:\n' + (AIW.withWeak && ks.length ? ks.map(k => { const d = cheatEntry(k); return `- ${d.en}（${d.zh}）`; }).join('\n') : '- (I will tell you.)');
  }
  return t + '\n\nLet\'s start.';
}
function copyText(text) {
  const done = () => toast('已複製，貼到 ChatGPT 就可以開始');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
  else fallback();
  function fallback() { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('無法自動複製，請長按文字手動複製'); } ta.remove(); }
}
function renderAI() {
  window.__rerender = null;
  const weakN = weakKeysAll(DB.role).length;
  app.innerHTML = `<div class="start">
<div class="topbar"><div class="l"><button class="iconbtn" id="aiBack" aria-label="回首頁">${ic('back')}</button><h2>AI 口語陪練</h2></div></div>
<div class="card" style="font-size:14px;line-height:1.7">自由對話和臨場應變，用 ChatGPT 或 Claude 的語音模式練最有效。複製指令 → 打開 App 貼上 → 切到語音模式開始。<br><span class="muted">這個網站不會、也無法自動取得你和 AI 的對話內容。</span></div>
${AI_MODES.map((m, i) => `<div class="card aicard"><div><b>${m.name}</b><small class="muted">　${m.desc}</small></div>
${m.id === 'weak' ? `<label style="display:flex;align-items:center;gap:8px;font-size:14px"><input type="checkbox" id="aiWeak" ${AIW.withWeak ? 'checked' : ''} style="width:20px;height:20px">一併附上我的待加強話術（${weakN} 句）</label>` : ''}
<details><summary>看完整指令</summary><pre class="aipre">${esc(aiPrompt(m))}</pre></details>
<div style="display:flex;gap:8px"><button class="btn pink" data-copy="${i}" style="flex:1">複製指令</button><a class="btn" href="https://chatgpt.com/" target="_blank" rel="noopener" style="flex:1;text-decoration:none">開啟 ChatGPT</a></div></div>`).join('')}
<div class="card setcard"><b>把 AI 練習的結果帶回來</b><span class="muted" style="font-size:13px">把 AI 建議你多練的句子加進來，會出現在「弱點加強」和快速複習。</span>
<label class="sr" for="cuEn">英文</label><input id="cuEn" class="inp" placeholder="英文句子（例：Let me say that again.）">
<label class="sr" for="cuZh">中文</label><input id="cuZh" class="inp" placeholder="中文意思（可留空）">
<button class="btn mint" id="cuAdd">加入待加強</button>
${DB.custom.length ? `<div class="muted" style="font-size:13px">已加入的自訂句子：${DB.custom.length} 句</div>` : ''}</div>
<div class="footer">© 2026 啾啾菇</div></div>`;
  $('#aiBack').onclick = renderStart;
  if ($('#aiWeak')) $('#aiWeak').onchange = e => { AIW.withWeak = e.target.checked; renderAI(); };
  document.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copyText(aiPrompt(AI_MODES[+b.dataset.copy])));
  $('#cuAdd').onclick = () => {
    const en = $('#cuEn').value.trim(); if (!en) { toast('先輸入英文句子'); return; }
    const key = 'c_' + Date.now().toString(36);
    DB.custom.push({ key, sec: '自訂', type: 'ext', role: DB.role, en, zh: $('#cuZh').value.trim() || '（自訂句子）', sit: '這是你從 AI 練習帶回來的句子，試著在對應情境中說出來。', alts: [], status: 'new', custom: true });
    DB.weakManual.push(key); save(); toast('已加入待加強'); renderAI();
  };
  window.scrollTo(0, 0);
}

/* =========================================================
   離線（Service Worker）與更新提示
   ========================================================= */
let swReg = null;
async function offlineReady() {
  if (!('caches' in window) || !('serviceWorker' in navigator)) return null;
  try { for (const u of PRECACHE) { if (!(await caches.match(new Request(u, { cache: 'reload' }).url, { ignoreSearch: true }))) return false; } return true; } catch (e) { return false; }
}
async function showOfflineStatus(el) {
  if (!el) return;
  if (!('serviceWorker' in navigator)) { el.textContent = '這個瀏覽器不支援離線使用'; return; }
  if (location.protocol === 'file:') { el.textContent = '本機預覽模式（上傳到 GitHub Pages 後才會啟用離線）'; return; }
  el.textContent = '檢查離線準備狀態⋯';
  const ok = await offlineReady();
  el.innerHTML = ok ? '<span class="gram-ok">● 已可離線使用</span>' : '○ 離線資料準備中（保持網路開著，稍後重新整理）';
}
function showUpdateBanner() {
  const el = $('#updBanner'); if (!el || !swReg || !swReg.waiting) return;
  el.innerHTML = `<div class="upd"><span>有新版本可以更新</span><button class="btn pink" id="updGo" style="min-height:40px">更新</button></div>`;
  $('#updGo').onclick = () => { swReg.waiting.postMessage('SKIP_WAITING'); };
}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      swReg = reg;
      reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(); }); });
      showUpdateBanner();
    }).catch(() => { /* 離線功能失敗不影響其他功能 */ });
    let reloading = false;
    const hadController = !!navigator.serviceWorker.controller; // 第一次安裝時不重新整理，只有更新版本才換頁
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading || LV || !hadController) return; reloading = true; location.reload(); });
  });
}

/* ---------- 啟動 ---------- */
renderStart();
