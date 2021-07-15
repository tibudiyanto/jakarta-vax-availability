import breakpoints from './breakpoints';
import icons from './icons';

import { extendTheme, ThemeOverride } from '@chakra-ui/react';

export default extendTheme(<ThemeOverride>{
  breakpoints,

  colors: {
    black: '#16161d'
  },

  components: {
    Link: {
      baseStyle: ({ colorMode }) => ({
        color: colorMode === 'dark' ? 'blue.300' : 'blue.500',
        _hover: {
          color: colorMode === 'dark' ? 'blue.500' : 'blue.700'
        }
      })
    }
  },

  fonts: {
    //
  },

  icons,

  styles: {
    global: () => ({
      html: {
        scrollBehavior: 'smooth'
      },
      body: {
        cursor: 'default',

        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility'
      },
      '.mapboxgl-popup-content': {
        bg: 'transparent',
        borderRadius: '6px',
        p: 0
      },
      '.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
        borderTopColor: 'black'
      }
    })
  }
});
