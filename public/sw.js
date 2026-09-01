// Minimal service worker — exists so Chrome/Android will treat this site as
// "installable" (add to home screen), NOT to provide an offline mode. It
// never touches /api/* or non-GET requests (those always go straight to
// the network, so login/session/data is always live) and for everything
// else it's network-first: always fetch fresh, only falling back to the
// last-cached copy if the network request fails outright (e.g. a brief
// factory wifi drop). That way a re-uploaded app.js/index.html always wins
// over whatever's cached — no "why isn't my update showing up" surprise.
var CACHE_NAME = "team-archive-shell-v1";
var SHELL_ASSETS = ["/", "/app.js", "/qrcode-lib.js", "/manifest.json"];

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_ASSETS);
    }).catch(function () {})
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  var url = new URL(req.url);
  if (req.method !== "GET" || url.pathname.indexOf("/api/") === 0) {
    return; // let the browser handle it normally — no caching, no interception
  }
  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (cached) {
        return cached || caches.match("/");
      });
    })
  );
});
