# Angular PWA Showcase

A compact, production-ready reference for building a progressive web app with modern Angular. The project intentionally stays small so the PWA pieces are easy to find, run, and reuse.

## What this demonstrates

- Angular 22 with standalone bootstrapping—there are no `NgModule` files.
- Zoneless change detection, the default in Angular 21+, with `zone.js` removed completely.
- Signals for all mutable UI state and `OnPush` change detection.
- Angular's service worker for app-shell and static-asset caching.
- A complete web app manifest with install icons and standalone display mode.
- Online/offline status that updates live.
- Browser notification permission and creation of a Web Push subscription.
- A local notification confirming that the service worker is active.

> The Angular service worker is disabled during the normal development build. Use the production preview below when testing installation, caching, offline behavior, or notifications.

## Requirements

- Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0`
- npm 11 or newer recommended
- A current Chromium, Firefox, or Safari browser

## Start developing

```bash
npm install
npm start
```

Open <http://localhost:4200>. This mode has fast rebuilds, but does not register the service worker.

## Run the real PWA locally

Build the optimized application and serve the generated browser output:

```bash
npm run build:prod
npm run preview:pwa
```

Open <http://localhost:8080>. Browsers treat `localhost` as a secure context, so service workers and notifications work without a local TLS certificate.

To verify the demo:

1. Open browser DevTools and confirm `ngsw-worker.js` is registered under Application → Service Workers.
2. Click **Enable notifications** and accept the browser prompt. A local confirmation notification appears and the generated `PushSubscription` can be inspected on the page.
3. Reload once while online so the current application version is cached.
4. In DevTools, set the network to **Offline**, then reload. The app shell should still load and the network indicator should change to Offline.
5. Use the browser's install action to launch the app in standalone mode.

If an older build appears after an upgrade, unregister the service worker and clear site data in DevTools, then reload.

## How the PWA is assembled

| Concern | Implementation |
| --- | --- |
| Standalone entry point | `src/main.ts` uses `bootstrapApplication` |
| Zoneless rendering | Angular 22 default; no zone provider, polyfill, or dependency |
| Reactive UI | Writable signals in `AppComponent` |
| Service-worker registration | `provideServiceWorker` in `src/main.ts` |
| Cache policy | `ngsw-config.json` |
| Install metadata | `src/manifest.webmanifest` |
| App icons | `src/assets/icons/` |
| Production output | `dist/angular-pwa-showcase/browser/` |

The `app` asset group is prefetched so the application shell works offline. The `assets` group is installed lazily and updated ahead of the next request. Angular generates `ngsw.json` from this policy during a production build.

## Push notifications: demo versus production

The included VAPID public key is suitable only for demonstrating browser subscription creation. Creating a subscription does **not** send it to an application server.

A production push flow must:

1. Generate and securely store its own VAPID key pair.
2. Replace `DEMO_VAPID_PUBLIC_KEY` in `src/app/app.component.ts` with the public key.
3. Send the returned subscription JSON to an authenticated backend over HTTPS.
4. Store subscriptions with user consent and provide an unsubscribe/delete path.
5. Send Web Push messages from the backend using the matching private key.

Never place the VAPID private key in the Angular application.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm start` | Development server on port 4200 |
| `npm run build` | Production build with service-worker artifacts |
| `npm run build:prod` | Explicit production build alias |
| `npm run preview:pwa` | Static server for the production PWA on port 8080 |
| `npm test` | Run the headless Vitest unit tests |
| `npm run watch` | Rebuild continuously with development settings |

## Deployment checklist

- Serve the `dist/angular-pwa-showcase/browser/` directory over HTTPS.
- Route navigation fallbacks to `index.html` without rewriting requests for real assets.
- Do not apply long-lived caching to `index.html`, `ngsw.json`, or `ngsw-worker.js`.
- Long-lived immutable caching is safe for hashed JavaScript and CSS files.
- Keep `manifest.webmanifest` and all icon paths publicly reachable.
- Test an update from the previously deployed version, not only a clean installation.
- Use browser DevTools or Lighthouse to verify installability and offline behavior.

## Upgrade notes

This repository was migrated sequentially from Angular 16 through Angular 22 using the official Angular CLI migrations. It now uses the application builder, standalone APIs, block template control flow, signals, and Angular's default zoneless runtime.

For framework details, see the official guides for [service workers and PWAs](https://angular.dev/ecosystem/service-workers), [zoneless Angular](https://angular.dev/guide/zoneless), and [keeping Angular up to date](https://angular.dev/update).
