# KKCC PWA, Play Store and App Store Readiness

This app is now optimized as a responsive installable PWA first. That means it can be opened in Chrome and installed to the home screen without needing Play Store or App Store today.

## Current install path

### Android / Chrome

1. Open the deployed KKCC website in Chrome.
2. Wait for the install prompt, or open Chrome menu.
3. Tap **Install app** or **Add to Home screen**.
4. KKCC opens like a standalone app and keeps core app files cached.

### Desktop Chrome / Edge

1. Open the deployed website.
2. Click the install icon in the address bar, or use browser menu.
3. Install KKCC.

### iPhone / iPad

PWA install support depends on the browser and iOS version. If Chrome does not show install, open the website in Safari and use **Share → Add to Home Screen**.

## Future Play Store publishing

Recommended path: **Trusted Web Activity (TWA)** for Android.

You will need later:

- Final production domain with HTTPS.
- Android package name, for example `com.kkcc.excellencehub`.
- App signing certificate fingerprint.
- `/.well-known/assetlinks.json` generated for that exact package/fingerprint.
- Play Store listing graphics, privacy policy, app content declaration.

The current PWA manifest, icons, service worker and standalone display mode are already suitable for this route.

## Future App Store publishing

Recommended path: **Capacitor** or another native wrapper around the deployed web app.

You will need later:

- Apple Developer account.
- iOS bundle ID, for example `com.kkcc.excellencehub`.
- App icons and launch assets from the KKCC logo.
- Privacy labels and app review information.
- Native wrapper configuration pointing to the production web app or bundled web build.

## Performance notes

The app is tuned for:

- Responsive layouts across phone, tablet, desktop, Mac and large screens.
- Chrome installability with manifest + service worker.
- Faster repeat loads through smart asset caching, navigation preload, and cache-size limits.
- Low-power and save-data modes that reduce expensive blur, shadow and animation work.
- High-refresh displays with shorter transform-based motion for smoother 90/120 Hz feel.
- Throttled scroll UI updates so sticky navigation stays smooth on Android/iOS/tablets.
- Lazy/deferred non-critical UI such as install/update helpers, toast UI and admin custom JS.
- Lazy images/videos/iframes where appropriate.
- No browser-facing localhost dependency.

### Quick local readiness checks

Run these before publishing or sharing a new ZIP:

```bash
npm run check:pwa
npm run check
```

`npm run check:pwa` validates the manifest, service worker and required install icons.

Keep uploaded course thumbnails and material images compressed before publishing. For best speed, use WebP/JPEG thumbnails under 300 KB where possible.
