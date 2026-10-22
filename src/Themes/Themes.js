import { Platform } from 'react-native';

export const themes = {
  light: {
    background: '#FFFFFF',
    primary: '#3274CC',
    secondary: '#C4C4C4',
    error: "#D90202",
    secondaryText: '',
    inputContainer: "#F7F8F9",
    inputContainerBorder: "#E8ECF4",
    text: '#8391A1',
    highlightedText: "#141414",
    card: '#F5F5F5',
    button: '#0066CC',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#121212', //dark bg like grey
    text: '#FFFFFF',
    primary: '#61C3E3',
    inputContainer: "#F7F8F9",
    inputContainerBorder: "#E8ECF4",
    secondaryText: '#C4C4C4',
    highlightedText: "#141414",
    secondary: '',
    error: "#FF1C1C",
    card: '#1C1C1C',
    button: '#3399FF',
    buttonText: '#000000',

  },



  darkSea: {
    secondaryBackground: "#F3F3F980",
    cardContainer: 'white',
    greyText: '#333',
    background: '#0C1C2C',            // Rich dark blue for background
    primary: '#3274CC',              // Pure Plus brand blue (keep)
    secondary: '#7B9EBF',            // Muted steel blue for labels, secondary text
    textForWhiteBG: 'grey',
    teritary: '#69D4EA',
    error: '#FF4C4C',                // Brighter red for better contrast on dark
    secondaryText: '#A7B3C4',        // Lighter grey-blue for hint text
    inputContainer: '#14293E',       // Input background - slightly lifted from background
    inputContainerBorder: '#2D4A68', // Subtle border for input
    text: '#D0D8E0',                 // General white-ish text
    highlightedText: '#FFFFFF',      // Bright white for focus areas
    card: '#1A2D44',                 // Darker card surfaces
    button: '#3274CC',               // Primary blue button
    buttonText: '#FFFFFF',
    textForGlassEffext: '#0C1C2C',      // Button text
    onPrimaryContainer: 'rgba(97, 195, 227, 0.3)',
    tagBgColor: "#dbc7dfff",
    tagTextColor: "#d15debff",
    tagIconColor: "#dd92edff"
  },



  forest: {
    secondaryBackground: "#F3F3F980",         // Light glass-like overlay for modals/overlays
    cardContainer: '#F5F9F6',                // Gentle off-white with a greenish tint
    greyText: '#3A3A3A',                     // Neutral dark grey for general text
    background: '#0B2E13',                   // Deep forest green, calm and rich
    primary: '#3A9D23',                      // Strong forest green for brand elements
    secondary: '#6BA96E',                    // Soft leafy green for labels/hints
    textForWhiteBG: '#4A4A4A',               // Neutral text for white backgrounds
    teritary: '#A8D693',                     // Mossy light green (for highlights or accents)
    error: '#D9534F',                        // Earthy red for error state
    secondaryText: '#BFD8C0',                // Pale fern green for secondary/hint text
    inputContainer: '#1C4225',               // Slightly lifted green container
    inputContainerBorder: '#2F6140',         // Deeper green border to separate inputs
    text: '#E0F1E5',                         // Very light green-white for general text
    highlightedText: '#FFFFFF',              // Pure white for focused or bold areas
    card: '#234D2C',                         // Dark green card surface, contrast with background
    button: '#3A9D23',                       // Reuse primary for buttons
    buttonText: '#FFFFFF',                   // Always keep readable white
    textForGlassEffext: '#0B2E13',           // Deep background text on translucent areas
    onPrimaryContainer: 'rgba(83, 183, 94, 0.3)',  // Translucent leafy overlay
    tagBgColor: "#B8E6C1FF",                 // Soft minty background
    tagTextColor: "#297B47FF",               // Rich emerald green text
    tagIconColor: "#3F9E5FFF"                // Vibrant green for icons
  },


  /**
   * pureLight — the redesign theme (00-foundation). Light, premium hydration brand.
   * Keeps every legacy key `useTheme()` already returns (mapped to the nearest new
   * token so un-migrated screens still render) and ADDS the new design tokens below.
   * This is the active theme (see ThemeContext.jsx) — replaces darkSea / lightSurface.
   */
  pureLight: {
    // ---- new design tokens (00-foundation) ----
    surface: '#F3F7F8',          // screen background
    surfaceCard: '#FFFFFF',      // cards, inputs, sheets, dialogs, tab bar
    surfaceSunken: '#EAF0F3',    // inset panels, segmented-control track
    ink: '#212528',             // main text; selected chip fill
    inkMuted: '#706e6d',        // secondary text, placeholders, inactive tab
    onInk: '#FFFFFF',           // text on ink
    primary: '#0072A3',          // buttons, links, active tab, focus, selected
    onPrimary: '#FFFFFF',        // text on primary
    primaryTint: '#E8F5FB',      // selected-option fill, icon wells
    brandBlue: '#0099D6',        // logo blue — decorative only, never small/white text on it
    brandBlueLight: '#26A8DC',   // decorative highlight
    brandGreen: '#7EBC42',       // logo leaf — decorative only
    brandGreenLight: '#91C65E',  // decorative highlight
    sky300: '#83CBE2',           // water-tinted frames
    sky200: '#C3E1F0',           // product image wells, auth hero backgrounds
    accentBlue: '#176BF0',       // rare promo highlight
    borderSubtle: '#E2E8EB',     // decorative dividers
    borderStrong: '#7C878C',     // input/OTP borders, outline buttons, radio rings
    scrim: 'rgba(33,37,40,0.5)', // backdrops
    info: '#0B6585',  infoTint: '#E5F3F8',
    warning: '#8A5A00', warningTint: '#FDF3DC',
    success: '#3B7419', successTint: '#EDF6E4',
    danger: '#B8232B', dangerTint: '#FCEBEB',
    neutral: '#5F6467', neutralTint: '#ECEFF1',

    // ---- legacy keys, mapped to the nearest new token (keep un-migrated screens sane) ----
    secondaryBackground: '#EAF0F3',
    cardContainer: '#FFFFFF',
    greyText: '#212528',
    background: '#F3F7F8',       // legacy "screen bg" → surface
    secondary: '#6D6F70',        // legacy labels/secondary → inkMuted
    textForWhiteBG: '#212528',
    teritary: '#0099D6',         // legacy misspelling → brandBlue
    tertiary: '#0099D6',
    error: '#B8232B',            // legacy error → danger
    secondaryText: '#6D6F70',    // → inkMuted
    inputContainer: '#FFFFFF',   // → surfaceCard
    inputContainerBorder: '#7C878C', // → borderStrong
    text: '#212528',            // → ink
    highlightedText: '#212528',  // → ink (was bright white on dark; now ink on light)
    card: '#FFFFFF',            // → surfaceCard
    button: '#0072A3',           // → primary
    buttonText: '#FFFFFF',       // → onPrimary
    textForGlassEffext: '#212528',
    textForGlass: '#212528',
    onPrimaryContainer: '#E8F5FB', // → primaryTint
    disabled: '#5F6467',          // → neutral
    divider: '#E2E8EB',           // → borderSubtle
    tagBgColor: '#E8F5FB',        // → primaryTint
    tagTextColor: '#0072A3',      // → primary
    tagIconColor: '#0072A3',
  },


};

/**
 * Shared, theme-independent scales (DESIGN_SYSTEM.md §3–4). 4-pt grid.
 * Import directly: `import { spacing, radius, typography, fontFamily } from '../Themes/Themes'`.
 */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// Redesign radius scale (00-foundation): sm 12, md 20, lg 32, pill 999.
export const radius = { sm: 12, md: 20, lg: 32, pill: 999 };

/**
 * Screen side padding for the redesign (00-foundation) = 24 (spacing.xl).
 */
export const screenPadding = spacing.xl;

/**
 * Shadow helper — ONLY for floating things (tab bar, sheets, dialogs, toasts,
 * sticky bottom bars). Cards have NO shadow. Spread into a style:
 *   style={[styles.sheet, floatShadow]}
 */
export const floatShadow = Platform.select({
  ios: {
    shadowColor: '#212528',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },
  android: { elevation: 8 },
});

/**
 * Light surface palette — for screens that must render on a WHITE background inside the
 * dark darkSea theme (e.g. Modify Order, Bulk/Event Request). Keep the brand `primary` from the
 * active theme; everything else switches to dark-on-light so content is legible.
 * Usage: `const s = { ...lightSurface, primary: theme.primary };`
 */
export const lightSurface = {
  background: '#FFFFFF',
  card: '#F4F6FA',
  cardContainer: '#FFFFFF',
  text: '#1A2433',
  highlightedText: '#0C1C2C',
  secondaryText: '#6B7280',
  greyText: '#374151',
  divider: '#E5E8EF',
  inputContainer: '#F7F8F9',
  inputContainerBorder: '#E5E8EF',
  buttonText: '#FFFFFF',
};

/**
 * Font family (00-foundation).
 *
 * The redesign spec calls for **Inter** (weights 300 italic / 400 / 500 / 600 / 700).
 * This is a bare React Native app (not Expo), so Inter must be bundled as TTFs:
 *   1. Drop Inter-Light.ttf, Inter-LightItalic.ttf, Inter-Regular.ttf, Inter-Medium.ttf,
 *      Inter-SemiBold.ttf, Inter-Bold.ttf into `assets/fonts/`.
 *   2. Ensure `react-native.config.js` lists `assets/fonts` (added this session), then run
 *      `npx react-native-asset` and rebuild (pod install on iOS).
 *   3. Flip ACTIVE_FONT below from `lexend` to `inter`.
 *
 * Until the Inter TTFs are added, ACTIVE_FONT stays on the already-bundled **Lexend**
 * (same 300/400/500/600/700 weights) so nothing renders with a missing font.
 */
const inter = {
  light: 'Inter-Light',
  lightItalic: 'Inter-LightItalic',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const lexend = {
  light: 'Lexend-Light',
  lightItalic: 'Lexend-Light', // Lexend italic not bundled; fontStyle:'italic' approximates
  regular: 'Lexend-Regular',
  medium: 'Lexend-Medium',
  semibold: 'Lexend-SemiBold',
  bold: 'Lexend-Bold',
};

// Inter TTFs are bundled in assets/fonts (00-foundation). After adding fonts you
// must run `npx react-native-asset` and rebuild the app for them to load natively.
const ACTIVE_FONT = inter;

export const fontFamily = {
  light: ACTIVE_FONT.light,
  regular: ACTIVE_FONT.regular,
  medium: ACTIVE_FONT.medium,
  semibold: ACTIVE_FONT.semibold,
  bold: ACTIVE_FONT.bold,
};

/**
 * Type scale (00-foundation) — pair with the AppText component (variant="display" etc.).
 * Old variant names (h1/h2/h3/label/button…) are kept and mapped to the closest new style
 * so existing screens keep rendering.
 */
export const typography = {
  // new redesign variants
  displayLight: { fontFamily: ACTIVE_FONT.lightItalic, fontSize: 32, lineHeight: 38, fontStyle: 'italic' },
  display: { fontFamily: ACTIVE_FONT.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  title: { fontFamily: ACTIVE_FONT.semibold, fontSize: 18, lineHeight: 24 },
  cardTitle: { fontFamily: ACTIVE_FONT.medium, fontSize: 28, lineHeight: 32 },
  price: { fontFamily: ACTIVE_FONT.bold, fontSize: 18, lineHeight: 24 },
  bodyStrong: { fontFamily: ACTIVE_FONT.semibold, fontSize: 15, lineHeight: 22 },
  body: { fontFamily: ACTIVE_FONT.regular, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: ACTIVE_FONT.medium, fontSize: 14, lineHeight: 20 },
  button: { fontFamily: ACTIVE_FONT.semibold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: ACTIVE_FONT.regular, fontSize: 12, lineHeight: 16 },
  badge: { fontFamily: ACTIVE_FONT.semibold, fontSize: 11, lineHeight: 14, textTransform: 'uppercase', letterSpacing: 0.2 },

  // legacy names mapped to the closest new style (kept so existing screens render)
  h1: { fontFamily: ACTIVE_FONT.medium, fontSize: 28, lineHeight: 32 },      // → cardTitle
  h2: { fontFamily: ACTIVE_FONT.semibold, fontSize: 18, lineHeight: 24 },    // → title
  h3: { fontFamily: ACTIVE_FONT.semibold, fontSize: 18, lineHeight: 24 },    // → title
};

// Semantic colors + correctly-spelled aliases, merged into every theme WITHOUT
// removing any existing keys (so all ~230 current consumers keep working).
const semantic = {
  success: '#2FBF71',
  warning: '#E0A500',
  info: '#69D4EA',
  disabled: '#3A4A5C',
  divider: '#22384F',
};

Object.keys(themes).forEach((name) => {
  const t = themes[name];
  // add semantic colors only if the theme didn't define them
  Object.entries(semantic).forEach(([k, v]) => { if (t[k] === undefined) t[k] = v; });
  // correctly-spelled aliases for the known typos (migrate call sites over time)
  if (t.tertiary === undefined && t.teritary !== undefined) t.tertiary = t.teritary;
  if (t.textForGlass === undefined && t.textForGlassEffext !== undefined) t.textForGlass = t.textForGlassEffext;
});


