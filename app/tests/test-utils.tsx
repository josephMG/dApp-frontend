// https://testing-library.com/docs/react-testing-library/setup/
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { darkTheme } from '@/libs/theme';
import DappWagmiProvider from '@/components/WagmiProvider';
import { mockSession } from "./helpers"

export * from '@testing-library/react';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
type DefaultParams = Parameters<typeof render>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & { router?: Partial<NextRouter> };

const mockRouter: NextRouter = {
  basePath: '',
  isReady: true,
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
};

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

// Where you add your providers for mock testing wrapper
export function customRender(ui: RenderUI, { wrapper, router, ...options }: RenderOptions = {}) {
  wrapper = ({ children }) => (
    <DappWagmiProvider>
      <SessionProvider session={mockSession}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <RouterContext.Provider value={{ ...mockRouter, ...router }}>{children}</RouterContext.Provider>
          </ThemeProvider>
        </StyledEngineProvider>
      </SessionProvider>
    </DappWagmiProvider>
  );

  return render(ui, { wrapper, ...options });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
