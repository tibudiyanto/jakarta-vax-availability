import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = {
  mono: `'Menlo', ${defaultTheme.fonts.mono}`
};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em'
});

const theme = extendTheme({
  breakpoints,
  colors: {
    black: '#16161D',
    red: '#e74c3c',
    darkRed: '#eaa29b'
  },
  fonts,
  icons: {
    logo: {
      path: (
        <svg fill="none" height="3163" viewBox="0 0 3000 3163" width="3000" xmlns="http://www.w3.org/2000/svg">
          <rect fill="none" height="3162.95" width="3000" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: '0 0 3000 3163'
    }
  },
  styles: {
    global: {
      body: {
        cursor: 'default'
      }
    }
  }
});

export default theme;
