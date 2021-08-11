/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/* dependencies */
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheFirst } from "workbox-strategies";
import { NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

registerRoute(
  ({ request }) => request.destination === "style",
  new CacheFirst()
);

/* config */
precacheAndRoute(self.__WB_MANIFEST);

/* caching strategies */

/* Cache First (google fonts) */
registerRoute(
  ({ url }) => url.host.startsWith("fonts.g"),
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

/* Network First (grab request from network) */
registerRoute(({ url }) => url.pathname.startsWith('/posts'), // api end point
  new NetworkFirst()
)

/* Stale While Revalidate (avatar image) */
registerRoute(({ url }) => {
  console.log("url: ", url);
  // url.pathname.startsWith("/images/avatars/");
  url.href.startsWith("http");
}, new StaleWhileRevalidate());
