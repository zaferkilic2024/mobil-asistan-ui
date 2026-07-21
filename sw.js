// Asgari service worker. İki işi var:
//   1. Uygulamanın "kurulabilir" sayılması — paylaş menüsüne yerleşmenin şartı
//   2. Kabuğu önbelleğe alıp çevrimdışı açılabilmesi
//
// Veri ASLA önbelleğe alınmaz: kaynak listesi Supabase'den her açılışta
// tazelenir, bayat liste üzerinden "sustur" basmak yanlış kaynağı susturur.
const AD = 'sift-kabuk-v1';
const KABUK = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(AD).then(c => c.addAll(KABUK)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== AD).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const istek = e.request;
  // Yalnız kendi kabuğumuz; Supabase istekleri dokunulmadan geçer.
  if(istek.method !== 'GET' || new URL(istek.url).origin !== location.origin) return;
  e.respondWith(
    fetch(istek).then(y => {
      const kopya = y.clone();
      caches.open(AD).then(c => c.put(istek, kopya));
      return y;
    }).catch(() => caches.match(istek).then(y => y || caches.match('./')))
  );
});
