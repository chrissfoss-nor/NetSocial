# NetSocial

A cross-platform social networking app built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/), targeting **iOS** and **Android**.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS: a macOS machine with Xcode, or use the [Expo Go](https://expo.dev/client) app
- For Android: Android Studio with an emulator, or the [Expo Go](https://expo.dev/client) app on a physical device

### Install dependencies

```bash
npm install
```

### Run the app

| Platform | Command |
|----------|---------|
| Start (choose platform interactively) | `npm start` |
| Android | `npm run android` |
| iOS | `npm run ios` |
| Web (browser preview) | `npm run web` |

### Running on a physical device

Install the **Expo Go** app from the [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android), then scan the QR code shown after running `npm start`.

## Project structure

```
NetSocial/
├── App.js          # Main application component
├── app.json        # Expo / app configuration (name, icons, splash)
├── assets/         # App icons and splash screen images
└── index.js        # Expo entry point
```

## Building for distribution

Use [EAS Build](https://docs.expo.dev/build/introduction/) to produce production `.ipa` (iOS) and `.apk`/`.aab` (Android) bundles:

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```