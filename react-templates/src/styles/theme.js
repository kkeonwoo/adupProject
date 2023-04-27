const colors = {
  primary: '#696cff',
  secondary: '#788393',
  success: '#28a745',
  danger: '#FF0000',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#ccc',
  dark: '#333',
  muted: '#6c757d',
  white: '#fff',
  black: '#000',
  focusColor: '#333',
}

const fonts = {
  family: {
    base: `'Noto Sans KR', sans-serif`,
  }
}

const devSize = {
  mob: '768px',
  tablet: '1024px',
}

const mediaQuery = {
  mobile: `@media only screen and (max-width: ${devSize.mobile})`,
  tablet: `@media only screen and (max-width: ${devSize.tablet})`,
  desktopL: `@media only screen and (min-width: ${devSize.tablet})`,
};

const lightTheme = {
  ...colors,
}

const darkTheme = {
  ...colors,
  light: '#333',
  dark: '#ccc',
  white: '#000',
  black: '#fff',
  focusColor: '#ccc',
}

const theme = {
  colors,
  fonts,
  devSize,
  mediaQuery,
  lightTheme,
  darkTheme
};

export default theme;