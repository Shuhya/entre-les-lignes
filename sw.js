/* Entre les lignes — service worker : offline total après 1re visite.
   Stratégie : stale-while-revalidate (réponse cache instantanée + mise à jour en fond).
   Les ?v=N changent d'URL à chaque version → les nouvelles versions remplacent les anciennes,
   Le cache est vidé (autre nom) à chaque évolution du SW. */
const CACHE = "etl-v1";
const ASSETS = [
  "./", "./jeu.html", "./index.html", "./css/style.css",
  "./js/assets.js", "./js/story.js", "./js/engine.js",
  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./maskable-512.png",
  "./assets/img/menu.jpg", "./assets/img/vaubris.jpg", "./assets/img/quai9.jpg", "./assets/img/appart.jpg",
  "./assets/img/av-c.jpg", "./assets/img/av-j.jpg", "./assets/img/av-n.jpg",
  "./assets/img/av-cora.jpg", "./assets/img/av-yasmine.jpg",
  "./assets/audio/pluie.mp3"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.endsWith("/atelier.html")) return;          /* admin : jamais hors-ligne */
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request, { ignoreSearch: true });
      const fetchP = fetch(e.request).then(r => {
        if (r && r.ok) c.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return hit || (await fetchP) || c.match("./jeu.html", { ignoreSearch: true });
    })
  );
});
