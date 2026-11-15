# Rhytham Hearing Centre

Static website. Pages: `index.html` (home), `about.html`, `services.html`, `inside.html`, `visit.html`, `contact.html`. Styles: `styles.css` (base) and `pages.css` (inner pages, FAQ, page transitions). Script: `script.js`. Open `index.html` in a browser, or upload the folder to any static host.
Palette (from the logo): blue #1c4f94, navy #12335f, teal #2a9a86. Fonts load from Google Fonts.
WhatsApp number and the optional form endpoint are at the top of `script.js`.

The branded startup screen on the home page shows for 2.5 seconds (`LOADER_MIN_MS` at the top of the loader code in `script.js`), and longer if the page or its first offline cache is slow. It is skipped when a visitor moves between pages on the site, where the page transition plays instead. The service worker caches the page, styles, scripts, logos and gallery photos for later visits and offline use. Offline caching requires HTTPS (or localhost); opening the HTML file directly does not enable it. When publishing updates, bump `CACHE_NAME` in `service-worker.js` so returning visitors receive the new app shell.

Social links (Instagram, Facebook, YouTube) appear in the contact section, the footer and the structured data in `index.html`, and on `contact.html`. The FAQ questions are in the `#faq` section of `index.html` (and the matching FAQPage block in `<head>`).
