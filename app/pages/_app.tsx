import { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
// import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';

import { darkTheme, lightTheme } from '@/libs/theme';
import createEmotionCache from '@/libs/createEmotionCache';
import useThemeMode from '@/hooks/useThemeMode';
import DappWagmiProvider from '@/components/WagmiProvider';

// Determines if we are running on server or in client.
const isServerSideRendered = () => {
  return typeof window === 'undefined';
};
const clientSideEmotionCache = createEmotionCache();

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

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isMobile, setIsMobile] = useState(false);
  const { darkMode } = useThemeMode();

  useEffect(() => {
    setIsMobile(!!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));
  }, []);

  const muiTheme = darkMode ? lightTheme : darkTheme;

  return (
    <DappWagmiProvider>
      <SessionProvider session={pageProps.session}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={muiTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} isMobile={isMobile} />
          </ThemeProvider>
        </CacheProvider>
      </SessionProvider>
    </DappWagmiProvider>
  );
};

export default App;
