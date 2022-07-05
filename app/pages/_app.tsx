import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';

import { darkTheme, lightTheme } from '@/libs/theme';
import useThemeMode from '@/hooks/useThemeMode';

// Determines if we are running on server or in client.
const isServerSideRendered = () => {
  return typeof window === 'undefined';
};

/**
 * Accessibility tool - outputs to devtools console on dev only and client-side only.
 * @see https://github.com/dequelabs/axe-core-npm
 */
if (process.env.NODE_ENV !== 'production' && !isServerSideRendered()) {
  import('react-dom').then((ReactDOM) => {
    import('@axe-core/react').then((axe) => {
      axe.default(React, ReactDOM, 1000, {});
    });
  });
}

const App = ({ Component, pageProps }: AppProps) => {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isMobile, setIsMobile] = useState(false);
  const { darkMode } = useThemeMode();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    // Naive check for mobile
    setIsMobile(!!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));
  }, []);

  const muiTheme = darkMode ? lightTheme : darkTheme;

  return (
    <SessionProvider session={pageProps.session}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} isMobile={isMobile} />
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
};

export default App;
