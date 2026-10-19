/* Entre les lignes — service worker v2.1 (v2.72) : offline total + MAJ sans Ctrl+F5.
   Corrigé :
   - HTML (jeu.html, index.html, /) : network-first avec cache:no-cache (revalidation 304 à chaque navigation — GitHub Pages garde jeu.html 10 min sinon) — toujours la page fraîche en ligne,
     repli sur le cache uniquement hors-ligne.
   - Fichiers versionnés (?v=N) : cache-first EXACT (sans ignoreSearch) — l'URL change
     à chaque version, donc le ?v= redevient un vrai cache-buster.
   - Images/audios/icônes/manifest (non versionnés) : stale-while-revalidate.
   - skipWaiting + clients.claim + page reload automatique au changement de contrôleur. */
const CACHE = "etl-v2";
const SHELL = ["./", "./jeu.html", "./index.html"];
const PRE = [
  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./maskable-512.png",
  "./assets/img/menu.jpg", "./assets/img/vaubris.jpg", "./assets/img/quai9.jpg", "./assets/img/appart.jpg",
  "./assets/img/av-c.jpg", "./assets/img/av-j.jpg", "./assets/img/av-n.jpg",
  "./assets/img/av-cora.jpg", "./assets/img/av-yasmine.jpg",
  "./assets/audio/pluie.mp3",
  "./assets/img/echantillon.jpg",
  "./assets/img/fond-ecran.jpg",
  "./assets/img/fond-ecran-f.jpg",
  "./assets/img/surveillance.svg",
  "./assets/img/surveillance-f.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.concat(PRE)).catch(()=>{})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const isHTML = e.request.mode === "navigate" || e.request.destination === "document" ||
                 /\.(html)?$/i.test(url.pathname) || url.pathname === "/" || url.pathname.endsWith("/");
  e.respondWith(
    caches.open(CACHE).then(async c => {
      if (isHTML) {
        /* network-first : la page de jeu est TOUJOURS fraîche quand on est en ligne */
        try {
          const r = await fetch(e.request, { cache: "no-cache" });
          if (r && r.ok) { c.put(e.request, r.clone()); return r; }
          if (r) return r;
        } catch (x) {}
        return (await c.match(e.request, { ignoreSearch: true })) ||
               (await c.match("./jeu.html", { ignoreSearch: true })) ||
               new Response("Hors ligne", { status: 503, headers: { "Content-Type": "text/plain" } });
      }
      if (url.search) {
        /* URL versionnée (?v=N) : immuable, cache-first EXACT — c'est le cache-buster */
        const hit = await c.match(e.request);
        if (hit) return hit;
        try {
          const r = await fetch(e.request, { cache: "no-cache" });
          if (r && r.ok) c.put(e.request, r.clone());
          return r;
        } catch (x) { return (await c.match(url.pathname)) || null; }
      }
      /* fichiers statiques non versionnés : stale-while-revalidate */
      const hit = await c.match(e.request);
      const fetchP = fetch(e.request).then(r => {
        if (r && r.ok) c.put(e.request, r.clone());
        return r;
      }).catch(() => null);
      return hit || (await fetchP);
    })
  );
});
