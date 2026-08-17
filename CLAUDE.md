# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pureplus is a React Native 0.81 water delivery app (iOS + Android) built for customers to browse products, manage a cart, place/track orders, and handle subscriptions. Authentication is OTP-based (mobile number → OTP → JWT). The app targets both platforms from a single codebase.

## Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (after `bundle exec pod install` for native dep changes)
npm run ios

# Lint
npm run lint

# Tests
npm test

# Single test file
npx jest path/to/test.test.ts
```

**iOS native deps:** After modifying `package.json` native dependencies, run:
```bash
bundle exec pod install   # inside /ios
```

## Architecture

### Provider Stack (`App.tsx`)

The root wraps in this exact order (inner → outer):
```
NavigationContainer
  ToastProvider
    AppContextProvider
      ThemeProvider
        TabBarVisibilityProvider
          Redux Provider (store)
            AppNavigator
```

### Navigation (`src/Navigation/`)

- **`ActivityEntry.js`** — entry point screen; reads AsyncStorage keys (`isGetStartedViewed`, `isLoggedIn`) and resets navigation to `GetStarted`, `Login`, or `DashBoard`.
- **`AppNavigator.jsx`** — single flat `NativeStack` containing all screens. No nested stacks except the bottom tab navigator embedded as the `MainBottomNav` screen.
- **`MainBottomNav.jsx`** (`src/Screens/Main/`) — bottom tab with 4 tabs: Dashboard, CartScreen, MyOrdersScreen, Notification. Tab bar animates in/out via `BottomBarContext`.

Screen name → component mapping is all defined in `AppNavigator.jsx` — this is the authoritative list of route names.

### State Management

**Redux** (`src/Redux/`) manages server-derived data. Each domain has a slice + async thunks:

| Slice | Store key | Purpose |
|-------|-----------|---------|
| `AuthSlice` | `auth` | OTP send/verify, profile creation, temp user details |
| `ProductsSlice` | `products` | Product listings |
| `BannerSlice` | `banners` | Banner ads |
| `CartSlice` | `cart` | Cart items |
| `AddressSlice` | `address` | User addresses |
| `LocationSlice` | `locations` | Location data |
| `ProfileSlice` | `profile` | User profile |
| `SheduleOrderSlice` | `sheduleOrder` | Delivery slot scheduling |
| `OrderSlice` | `order` | Orders |

**Global logout** (`LogoutActions.js`): dispatching `logout()` sets Redux state to `undefined`, which resets all slices to initial state simultaneously.

**React Context** (`src/Context/`) manages UI/session state that doesn't need Redux:
- `AppContext` — current location, users address, bottom bar visibility, some legacy cart state (prefer Redux `cart` slice over context cart)
- `ThemeContext` — active theme; currently hardcoded to `darkSea` (toggle is wired but not exposed in UI)
- `BottomBarContext` — controls tab bar show/hide animation

### Data Layer (`src/API/` → `src/Repository/`)

**Two Axios clients:**
- `Client.js` — main API (`https://pureplusapp.in`), auto-attaches Bearer token, handles 401 with refresh token retry queue
- `MapClient.js` — Geoapify geocoding API (`https://api.geoapify.com/v1/geocode/`)

**Call chain:** Screen/Redux thunk → `Repository/*.js` → `API/Services/*.js` → Axios client → `EndPoint.js` constant

All endpoints are defined in `src/API/EndPoint.js`. When adding a new API call, add the path there first.

Auth whitelist in `Client.js`: `GETOTP`, `VERIFYOTP`, `REFRESHTOKEN` skip the Authorization header.

### Offline Storage (`src/OfflineStore/OfflineStore.js`)

Thin AsyncStorage wrapper with `storeData`, `getData`, `removeData`, `clearDataBeforeLogout`. `clearDataBeforeLogout` wipes everything **except** `isGetStartedViewed`.

**Known AsyncStorage keys:**
- `isGetStartedViewed` — onboarding flag (never cleared)
- `isLoggedIn` — session flag
- `accessToken` — JWT
- `userID` — numeric user ID
- `UsersCurrentAddress` — serialized address object

### Theming (`src/Themes/Themes.js`)

Three theme objects: `light`, `dark`, `darkSea`. Currently `darkSea` is always active (see `ThemeContext.jsx`). All components consume theme via `useTheme()` hook — never hardcode colors.

### Push Notifications (`src/Utils/FirebaseUtils.js`)

Uses `@react-native-firebase/messaging` + `@notifee/react-native`. Channel ID is `App_Notficiation` (note typo — keep consistent). Foreground listener is currently commented out.

### Environment Variables

Loaded via `react-native-dotenv` (import from `@env`). The `.env` file contains:
- `FREE_GEO_FENCING_APIKEY` — Geoapify key

The main API base URL is hardcoded in `src/API/Client.js` (not in `.env`).

## Key Conventions

- **File extensions:** Screens and components use `.jsx`; Redux slices, repositories, services, utilities use `.js`. TypeScript is configured but most files are JS/JSX.
- **Redux thunks accept `onSuccess`/`onError` callbacks** alongside data params — used for imperative navigation after async actions.
- **"Shedule" is the intentional spelling used throughout** the codebase (slice name, screen name, repository name) — keep this spelling for consistency.
- **`useUserId()` hook** (`src/customHooks/useUserID.js`) — standard way to get the current user ID from AsyncStorage in components.
- Lottie animations live in `assets/animations/`.
