# NetSocial

A cross-platform social networking application with a [Next.js](https://nextjs.org/) + [Supabase](https://supabase.com/) web app and a [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) mobile app for iOS and Android.

## Web App (Next.js)

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19.4 or later)

### Getting Started
A social networking application built with [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/).

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file and fill in your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project anon (public) key |

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Client
## Supabase Client

The Supabase client is initialised in `lib/supabaseClient.js` and can be imported anywhere in the project:

```js
import { supabase } from '../lib/supabaseClient';
```

---

## Mobile App (Expo / React Native)

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19.4 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS: a macOS machine with Xcode, or use the [Expo Go](https://expo.dev/client) app
- For Android: Android Studio with an emulator, or the [Expo Go](https://expo.dev/client) app on a physical device

### Getting Started

```bash
cd mobile
npm install
```

| Platform | Command |
|----------|---------|
| Start (choose platform interactively) | `npm start` |
| Android | `npm run android` |
| iOS | `npm run ios` |
| Web (browser preview) | `npm run web` |

Scan the QR code shown after `npm start` with the **Expo Go** app ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)).

### Building for distribution

Use [EAS Build](https://docs.expo.dev/build/introduction/) to produce production `.ipa` (iOS) and `.apk`/`.aab` (Android) bundles:

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

### Project structure

```
mobile/
├── App.js          # Main application component
├── app.json        # Expo / app configuration (name, icons, splash)
├── assets/         # App icons and splash screen images
└── index.js        # Expo entry point
```
