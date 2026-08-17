# PurePlus Customer App — Design System

> **What this is.** The design system of the existing React Native customer app, documented as-built, plus the token scales we are standardizing on during the rebuild. Source of truth for colors, typography, spacing, and shared components. Pair with `BUILD_PLAN.md` (phased build) and `../../pureplus_docs/client_build_guides/Customer_App_Build_Guide_RN.md` (API wiring).
>
> **Stack:** React Native 0.81.1, JavaScript/JSX, Redux Toolkit, React Navigation v7, Axios. Theme via `ThemeContext` + `useTheme()`.

---

## 1. Theming model (as-built)

Themes live in [`src/Themes/Themes.js`](src/Themes/Themes.js) and are served through [`src/Context/ThemeContext.jsx`](src/Context/ThemeContext.jsx):

```js
const { theme, isDark, toggleTheme } = useTheme();
// use: theme.primary, theme.background, theme.card, ...
```

- **Active theme: `darkSea`** — hardcoded in `ThemeContext` (`const currentTheme = themes.darkSea`). This is the canonical look.
- `light`, `dark`, `forest` also exist but are **incomplete** (missing keys) — do not switch to them without filling the full token set, or components read `undefined`.
- `isDark`/`toggleTheme` are currently inert (dark toggle disabled). Keep the hook API; wire real switching only after all themes have the full token set.

> **Rule:** always read colors from `useTheme().theme.*` — never hardcode hex in a component. This is what makes a future theme switch a one-line change.

---

## 2. Color tokens (canonical — `darkSea`)

| Token | Value | Use |
|---|---|---|
| `primary` | `#3274CC` | **Pure Plus brand blue** — buttons, active states, links |
| `teritary` *(sic)* | `#69D4EA` | Accent / highlight (cyan) |
| `background` | `#0C1C2C` | Screen background (rich dark blue) |
| `card` | `#1A2D44` | Card / surface |
| `secondaryBackground` | `#F3F3F980` | Glass overlay for modals |
| `cardContainer` | `white` | Light surfaces on dark bg |
| `text` | `#D0D8E0` | Body text (white-ish) |
| `highlightedText` | `#FFFFFF` | Emphasis / focus |
| `secondaryText` | `#A7B3C4` | Hint / secondary |
| `secondary` | `#7B9EBF` | Labels, muted text |
| `greyText` | `#333` | Text on light surfaces |
| `textForWhiteBG` | `grey` | Text on white cards |
| `inputContainer` | `#14293E` | Input background |
| `inputContainerBorder` | `#2D4A68` | Input border |
| `button` | `#3274CC` | Button background |
| `buttonText` | `#FFFFFF` | Button label |
| `textForGlassEffext` *(sic)* | `#0C1C2C` | Text on translucent areas |
| `error` | `#FF4C4C` | Error state |
| `onPrimaryContainer` | `rgba(97,195,227,0.3)` | Translucent primary overlay |
| `tagBgColor` | `#DBC7DF` | Tag/chip background |
| `tagTextColor` | `#D15DEB` | Tag/chip text |
| `tagIconColor` | `#DD92ED` | Tag/chip icon |

> **Known typos to preserve for now (used across ~230 call sites):** `teritary` (tertiary), `textForGlassEffext` (glass effect). Do **not** rename in place — add correctly-spelled **aliases** in Phase 1 and migrate gradually, or you break every consumer at once.

Semantic colors we standardize during the rebuild (add to every theme):

| Token | Suggested (dark) | Use |
|---|---|---|
| `success` | `#2FBF71` | Delivered, paid, positive |
| `warning` | `#E0A500` | Pending, overdue soon |
| `info` | `#69D4EA` | Neutral highlights |
| `disabled` | `#3A4A5C` | Disabled controls |
| `divider` | `#22384F` | Lines / separators |

---

## 3. Typography (to standardize)

Font today is applied ad-hoc (only `Poppins-SemiBold` and a stray `'bold'` appear). **Poppins** is the intended family but isn't tokenized. Standardize a scale (Phase 1 adds it to the theme as `theme.typography`):

| Token | Size / weight | Use |
|---|---|---|
| `h1` | 24 / SemiBold | Screen titles |
| `h2` | 20 / SemiBold | Section headers |
| `h3` | 17 / Medium | Card titles |
| `body` | 15 / Regular | Body text |
| `bodyStrong` | 15 / Medium | Emphasized body |
| `caption` | 13 / Regular | Hints, metadata |
| `label` | 12 / Medium | Chips, tags, small labels |
| `button` | 16 / SemiBold | Button labels |
| `price` | 18 / Bold | Prices (currency) |

Families to register: `Poppins-Regular`, `Poppins-Medium`, `Poppins-SemiBold`, `Poppins-Bold`. Use a `<AppText variant="h2">` wrapper (Phase 1) so no screen sets `fontFamily` by hand.

---

## 4. Spacing, radius, elevation (to standardize)

Introduce fixed scales (4-pt grid) as `theme.spacing` / `theme.radius`:

- **Spacing:** `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32`
- **Radius:** `sm 8 · md 12 · lg 16 · pill 999`
- **Elevation:** card shadow (Android `elevation: 3`, iOS shadow rgba(0,0,0,0.15)).

---

## 5. Component inventory (existing, reuse these)

Shared UI already exists in [`src/Components/`](src/Components/) — reuse and extend, don't re-create.

| Area | Components |
|---|---|
| **Buttons** | `AppButton`, `SmallButton`, `PrimaryGlassyButton`, `AppNavButton`, `AddToCartButton` |
| **Inputs** | `Inputs/CustomInput`, `EmailInput`, `NumberInput`, `PasswordInput`, `OTPInput`, `Dropdowns/CountryDropdown`, `SearchBar` |
| **Feedback** | `AppLoading`, `AppToast`, `AppModal`, `CustomDialog`, `AppAdvertiseMent` |
| **Layout/misc** | `Line`, `CustomImage`, `GlassyPerksContainer`, `Filters/FilterTag` |
| **Address** | `AddressBar`, `AddressWithChangeButton`, `LocationPermissionUI` |
| **Product** | `Product`, `ProductCard`, `Product/ProductCard1`, `ProductCardRect`, `ProductImages`, `Product/BookProduct`, `Product/IconWithTextFeatures`, `Product/ImageWithTitleDesc`, `BottomSheet/BottomSheetContentProduct` |
| **Cart** | `Cart/CartItem`, `OrderSummary`, `BottomPayMentBar`, `PaymentSection`, `PayButtonWithAddressBar`, `CartButton`, `ViewCartButton` |
| **Order** | `OrderItem`, `Order/OrderProdItem`, `OrderTracking`, `OrderTracking/OrderTimeLIne` |
| **Nav/Profile** | `DrawerContent`, `DrawerItem`, `Profile/FirstLetterAvatar`, `Banner`, `BannerCarousel` |

**New shared components to add during the rebuild:** `AppText` (typography), `PriceBreakdown` (checkout estimate rows: subtotal → GST → floor → deposit → grand total), `EmptyState`, `StatusBadge` (order lifecycle + postpaid), `WalletBadge`, `ScreenContainer` (safe-area + bg wrapper).

---

## 6. Iconography & assets

- Icons: `react-native-vector-icons` (v10). Standardize on one set (e.g. Ionicons or MaterialCommunityIcons) app-wide.
- Animations: `lottie-react-native` (loading/empty states), `react-native-shimmer-placeholder` (skeletons).
- Gradients: `react-native-linear-gradient` (glassy buttons/containers).
- Maps: `react-native-maps` — **note:** map/geocoding must go through the **backend Google Maps** endpoints, not Geoapify (see build plan CUS-07).

---

## 7. Conventions (enforce during the rebuild)

1. **No hardcoded colors/sizes** — always `useTheme()` + spacing/typography tokens.
2. **One `AppText`** for all text; no inline `fontFamily`.
3. **Wrap screens in `ScreenContainer`** (safe-area + `theme.background`).
4. **Money format** via a single `formatCurrency()` util (₹, 2 decimals).
5. **Loading/empty/error** states are mandatory per screen (skeleton → data → empty/error), never a blank screen.
6. **Store-scope aware** — after serviceability resolves a store, catalog/prices/slots are that store's; re-validate cart on address switch.
