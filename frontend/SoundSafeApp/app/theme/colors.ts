// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette: Record<string, string> = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#91b5c4",
  primary200: "#81acbd",
  primary300: "#6fa3b8",
  primary400: "#609ab2",
  primary500: "#4f94b0",
  primary600: "#1886b3",

  secondary100: "#a2d6d7",
  secondary200: "#8bd0d0",
  secondary300: "#7ccecf",
  secondary400: "#6fcfd0",
  secondary500: "#4fc3c4",

  accent100: "#97b6c0",
  accent200: "#7496a0",
  accent300: "#457889",
  accent400: "#317287",
  accent500: "#1d6b84",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
