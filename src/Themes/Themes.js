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


};

/**
 * Shared, theme-independent scales (DESIGN_SYSTEM.md §3–4). 4-pt grid.
 * Import directly: `import { spacing, radius, typography, fontFamily } from '../Themes/Themes'`.
 */
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

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

// Aligned with the existing font registry (assets/fonts/Fonts.js) — the app ships Lexend.
export const fontFamily = {
  regular: 'Lexend-Regular',
  medium: 'Lexend-Medium',
  semibold: 'Lexend-SemiBold',
  bold: 'Lexend-Bold',
  light: 'Lexend-Light',
};

// Type scale — pair with the AppText component (variant="h2" etc.)
export const typography = {
  h1: { fontFamily: fontFamily.semibold, fontSize: 24 },
  h2: { fontFamily: fontFamily.semibold, fontSize: 20 },
  h3: { fontFamily: fontFamily.medium, fontSize: 18 },
  body: { fontFamily: fontFamily.regular, fontSize: 15 },
  bodyStrong: { fontFamily: fontFamily.medium, fontSize: 15 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12 },
  label: { fontFamily: fontFamily.medium, fontSize: 12 },
  button: { fontFamily: fontFamily.semibold, fontSize: 16 },
  price: { fontFamily: fontFamily.bold, fontSize: 18 },
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


