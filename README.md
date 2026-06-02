# NAV-PWA-1 — PWA Registration Repair Package

Upload these files to the **root** of the `SPC-Navigator` repository:

- `index.html`
- `manifest.json`
- `sw.js`
- `icons/icon-180.png`
- `icons/icon-192.png`
- `icons/icon-512.png`

This package is GitHub Pages-safe for the project URL:

`https://rmertzman-tech.github.io/SPC-Navigator/`

The app uses relative paths (`./manifest.json`, `./sw.js`, `./icons/...`) so it should work under the `/SPC-Navigator/` project path.

After upload:

1. Wait 1–5 minutes.
2. Open the Navigator in a private/incognito window.
3. Confirm the PWA status no longer says “PWA registration failed.”
4. If it still fails, open DevTools → Application → Service Workers and unregister old workers, then reload.
5. You can also use the Navigator’s PWA cache-clear button if visible.

The service worker caches only the app shell. It does not cache private writing, chapter imports, exports, or API content.
