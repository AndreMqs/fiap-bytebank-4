/**
 * Breakpoints padrão para responsividade
 * Seguindo abordagem Mobile First
 */
export const breakpoints = {
  mobile: '425px',
  tablet: '768px',
  desktop: '1024px',
  largeDesktop: '1920px',
} as const

/**
 * Media query helpers para uso em JavaScript/TypeScript
 */
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.mobile})`,
  tablet: `(min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `(min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  largeDesktop: `(min-width: ${breakpoints.largeDesktop})`,
  tabletAndUp: `(min-width: ${breakpoints.tablet})`,
  desktopAndUp: `(min-width: ${breakpoints.desktop})`,
} as const

/**
 * SCSS variables para uso em arquivos .scss
 * Importar com: @import '../../utils/breakpoints.scss';
 */
export const scssBreakpoints = `
$mobile: ${breakpoints.mobile};
$tablet: ${breakpoints.tablet};
$desktop: ${breakpoints.desktop};
$largeDesktop: ${breakpoints.largeDesktop};
`

