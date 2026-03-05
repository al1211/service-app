const colors = {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔵 Primary Brand — Deep Indigo
  // Feels premium, modern, trustworthy
  // Used: Buttons, active states, links, icons
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  primary:       "#1D4ED8",   // Deep Royal Blue
  primaryLight:  "#3B82F6",   // Bright Blue (hover / highlights)
  primaryDark:   "#1E3A8A",   // Navy (pressed states)
  primarySoft:   "#EFF6FF",   // Ghost tint (chip bg, tag bg)

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🟢 Success — Emerald
  // Used: Trip completed, payment success, online badge
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  success:       "#059669",   // Emerald (richer than green)
  successLight:  "#34D399",   // Mint highlight
  successSoft:   "#ECFDF5",   // Tint background

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔴 Danger — Warm Red
  // Used: Cancelled, failed, alert, delete
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  danger:        "#DC2626",
  dangerLight:   "#FCA5A5",
  dangerSoft:    "#FEF2F2",   // Tint background

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🟡 Warning — Amber
  // Used: Pending, ETA delay, low battery driver
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  warning:       "#D97706",   // Deeper amber (more readable)
  warningLight:  "#FCD34D",
  warningSoft:   "#FFFBEB",

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🟣 Driver Mode — Violet
  // Used: Driver dashboard, driver-specific UI elements
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  driver:        "#6D28D9",   // Deep Violet
  driverLight:   "#A78BFA",
  driverSoft:    "#F5F3FF",

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🟠 Accent — Warm Amber/Orange
  // NEW: Used for price, promo banners, CTA highlights
  // Gives energy — makes pricing & offers pop
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  accent:        "#F97316",   // Vibrant Orange
  accentLight:   "#FDBA74",
  accentSoft:    "#FFF7ED",

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⚫ Neutrals — Cool Slate
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  background:    "#F8FAFC",   // App background (keep yours)
  surface:       "#FFFFFF",   // Cards, sheets, modals
  surfaceAlt:    "#F1F5F9",   // Input bg, inactive tab bg
  border:        "#E2E8F0",   // Dividers, input borders
  borderFocus:   "#93C5FD",   // Input focused border
  overlay:       "rgba(15, 23, 42, 0.45)", // Modal backdrop

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🖋 Typography
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  textPrimary:   "#0F172A",   // Headings, bold labels
  textSecondary: "#475569",   // Body, descriptions (slightly darker than yours)
  textLight:     "#94A3B8",   // Placeholders, hints, timestamps
  textDisabled:  "#CBD5E1",   // Disabled inputs, inactive labels
  textInverse:   "#FFFFFF",   // Text on dark/colored buttons

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🗺️ Map UI (important for ride apps!)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  mapPickup:     "#1D4ED8",   // Blue pin = pickup
  mapDrop:       "#059669",   // Green pin = destination
  mapRoute:      "#3B82F6",   // Route line color
  mapDriver:     "#F97316",   // Driver car marker

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌙 Dark Mode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  darkBackground: "#0B1120",  // Deeper than yours (more premium)
  darkSurface:    "#1E293B",
  darkCard:       "#1E293B",
  darkBorder:     "#334155",
  darkText:       "#F1F5F9",
  darkTextSub:    "#94A3B8",
};

export default colors;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USAGE GUIDE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
//  BUTTONS
//    Primary CTA       → bg: primary,       text: textInverse
//    Secondary CTA     → bg: primarySoft,   text: primary
//    Danger action     → bg: danger,        text: textInverse
//    Ghost/outline     → border: border,    text: textPrimary
//
//  STATUS BADGES
//    Completed         → bg: successSoft,   text: success
//    Pending           → bg: warningSoft,   text: warning
//    Cancelled         → bg: dangerSoft,    text: danger
//    Active/Live       → bg: primarySoft,   text: primary
//
//  INPUTS
//    Default border    → border
//    Focused border    → borderFocus
//    Background        → surfaceAlt
//    Placeholder       → textLight
//
//  CARDS
//    Background        → surface (#FFFFFF)
//    Shadow            → rgba(0,0,0,0.06)
//
//  PRICE / OFFERS
//    Highlight price   → accent (#F97316)
//    Discount badge    → bg: accentSoft, text: accent
//
//  DRIVER MODE
//    All driver UI     → driver (#6D28D9) replaces primary
//    Online badge      → success
//    Offline badge     → textLight
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━