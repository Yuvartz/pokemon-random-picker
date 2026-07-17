export const COLORS = {
  background: "#F4F6FA",
  backgroundRaised: "#FAFBFD",
  card: "#FFFFFF",
  surfaceMuted: "#EEF1F6",
  surfaceStrong: "#E5EAF2",
  text: "#182033",
  textSecondary: "#596274",
  textMuted: "#7B8495",
  border: "#DDE2EB",
  borderStrong: "#C9D1DE",
  buttonText: "#FFFFFF",
  danger: "#B83B32",
  dangerBackground: "#FFF2F0",
  dangerBorder: "#F0C8C3",
  placeholder: "#B8C0CE",
  shadow: "#111827",
  whiteOverlay: "rgba(255, 255, 255, 0.24)",
  pressedOverlay: "rgba(24, 32, 51, 0.06)",
};

export const SPACING = {
  xs: 4,
  s: 8,
  sm: 12,
  m: 16,
  ml: 20,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const RADIUS = {
  xs: 8,
  s: 12,
  badge: 14,
  button: 18,
  card: 24,
  cardOuter: 30,
  pill: 999,
};

export const TYPOGRAPHY = {
  screenTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800" as const,
  },
  cardTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900" as const,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800" as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700" as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const,
  },
};

export const SHADOWS = {
  subtle: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  raised: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.11,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  card: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.17,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
};

/** Minimum comfortable touch target size (accessibility). */
export const MIN_TOUCH = 48;
