const palette = {
  text: "#f7f4ed",
  background: "#070a12",
  tint: "#c8992d",
  foreground: "#f7f4ed",
  card: "#0a0e1a",
  cardForeground: "#f7f4ed",
  primary: "#c8992d",
  primaryForeground: "#0a0e1a",
  secondary: "#12182b",
  secondaryForeground: "#f7f4ed",
  muted: "#12182b",
  mutedForeground: "#7e89a9",
  accent: "#c8992d",
  accentForeground: "#0a0e1a",
  destructive: "#d92626",
  destructiveForeground: "#ffffff",
  border: "#151d32",
  input: "#12182b",
};

// LensFlow is a dark, gold-accented brand — keep the same palette for both
// schemes so the app always renders in its signature dark theme.
const colors = {
  light: palette,
  dark: palette,
  radius: 12,
};

export default colors;
