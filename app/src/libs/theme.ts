import { amber, grey, red } from '@mui/material/colors';
import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    fontWeightHeavy: number;
  }
  interface TypographyOptions {
    fontWeightHeavy: number;
  }
}

type CustomTheme = {
  [Key in keyof typeof darkMuiTheme]: typeof darkMuiTheme[Key];
};

declare module '@mui/material/styles' {
  type Theme = CustomTheme;
  type ThemeOptions = CustomTheme;
}

const fontFamilyMetropolis = {
  fontFamily: [
    'Metropolis',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  letterSpacing: '0.015rem',
};

const fontFamilyRoboto = {
  fontFamily: ['Roboto', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(
    ','
  ),
};

const THEME: ThemeOptions = {
  typography: {
    ...fontFamilyRoboto,
    fontWeightLight: 100,
    fontWeightMedium: 300,
    fontWeightRegular: 400,
    fontWeightHeavy: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.6rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.4rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '.8rem',
      fontWeight: 400,
    },
    overline: {
      fontWeight: 500,
      fontSize: '0.7rem',
    },
  },
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.5,
  },
  shape: {
    borderRadius: '0.5rem',
  },
  components: {
    // MuiCssBaseline: {
    // "@global": {
    //   "@font-face": [
    //     Fonts.MetropolisRegular,
    //     Fonts.MetropolisBold,
    //     Fonts.RobotoRegular,
    //     Fonts.RobotoMedium,
    //     Fonts.RobotoBold
    //   ]
    // }
    // },
    MuiListItemText: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: { color?: string } }) => ({
          ...(ownerState.color === 'primary' && {
            ...fontFamilyMetropolis,
            fontWeight: 500,
            fontSize: '0.87rem',
          }),
        }),
      },
    },
  },
};

const lightMuiTheme = {
  palette: {
    mode: 'light',
    secondary: {
      main: amber[500],
      light: '#feefc3',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFF',
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
  custom: {
    fontFamily: {
      roboto: fontFamilyRoboto,
      metropolis: fontFamilyMetropolis,
    },
    palette: {
      iconColor: '#5f6368',
      itemBorderColor: '#DDDDDD',
      iconHighlight: grey[900],
      notesCheckbox: grey[700],
      profilePopColor: '#FFF',
      noteBackground: {
        default: '#0000',
        red: '#F28B82',
        orange: '#FBBC04',
        yellow: '#FFF475',
        green: '#CCFF90',
        cyan: '#A7FFEB',
        lightblue: '#CBF0F8',
        darkblue: '#AECBFA',
        purple: '#D7AEFB',
        pink: '#FDCFE8',
        brown: '#E6C9A8',
        grey: '#E8EAED',
      },
      noteColorCheck: '#0007',
      labelBackground: '#0002',
    },
  },
};

const darkMuiTheme = {
  palette: {
    mode: 'dark',
    secondary: {
      main: amber[500],
      light: '#41331C',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#212121',
      paper: '#212121',
    },
    text: {
      primary: '#E8EAED',
      secondary: '#FFFFFFDE',
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
  custom: {
    fontFamily: {
      roboto: fontFamilyRoboto,
      metropolis: fontFamilyMetropolis,
    },
    palette: {
      iconColor: '#949596',
      itemBorderColor: '#5F6368',
      iconHighlight: '#888A8B',
      notesCheckbox: '#5F6368',
      profilePopColor: '#2D2E30',
      noteBackground: {
        default: '#0000',
        red: '#5C2B29',
        orange: '#614A19',
        yellow: '#635D18',
        green: '#345920',
        cyan: '#16504B',
        lightblue: '#2D555E',
        darkblue: '#1E3A5F',
        purple: '#42275E',
        pink: '#5B2245',
        brown: '#442F19',
        grey: '#3C3F43',
      },
      noteColorCheck: '#FFF7',
      labelBackground: '#0002',
    },
  },
};

export const lightTheme = responsiveFontSizes(createTheme({ ...THEME, ...lightMuiTheme } as ThemeOptions));
export const darkTheme = responsiveFontSizes(createTheme({ ...THEME, ...darkMuiTheme } as ThemeOptions));
export type { CustomTheme };
const theme = responsiveFontSizes(createTheme(THEME));

export default theme;
