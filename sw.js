/* 關主英文助手｜Service Worker（GitHub Pages /host-sim/ 子路徑，全部使用相對路徑） */
importScripts('./files.js');
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' })))));
  // 不自動 skipWaiting：等使用者在首頁按「更新」，避免現場模式中途換版
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('host-sim-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // 同網站：先用快取（同一版本的檔案一起快取，不會新舊混用）
    e.respondWith(caches.open(CACHE_NAME).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match('./index.html') : null);
      if (hit) return hit;
      try { return await fetch(req); } catch (err) { return (await c.match('./index.html')) || Response.error(); }
    }));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    // 字型：有網路時順便存起來；離線時改用系統字型
    e.respondWith(caches.open('host-sim-fonts').then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
  }
});
