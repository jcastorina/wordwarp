import Typography from "typography"
import fairyGatesTheme from "typography-theme-fairy-gates"

const typography = new Typography(fairyGatesTheme)
  
typography.injectStyles()

export default typography
export const rhythm = typography.rhythm