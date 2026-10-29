# Rhytham Hearing Centre

Static website: `index.html`, `styles.css`, `script.js`. Open `index.html` in a browser, or upload the folder to any static host.
Palette (from the logo): blue #1c4f94, navy #12335f, teal #2a9a86. Fonts load from Google Fonts.
WhatsApp number and the optional form endpoint are at the top of `script.js`.

The branded startup screen waits for the page and its first offline cache to be ready, for up to about 3 seconds. The service worker caches the page, styles, scripts, logos and gallery photos for later visits and offline use. Offline caching requires HTTPS (or localhost); opening the HTML file directly does not enable it. When publishing updates, bump `CACHE_NAME` in `service-worker.js` so returning visitors receive the new app shell.
