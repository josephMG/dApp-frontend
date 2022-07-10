import React from 'react'
import { render } from '@testing-library/react';

describe('WagmiProvider component without env', () => {
  const OLD_ENV = process.env;
  beforeAll(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_RPC_URL: '' }; // Make a copy
  });
  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  it('url equal localhost', () => {
    const Test = () => {
      const { useProvider } = require('wagmi');
      const providers = useProvider();
      const url = providers.chains!.find((chain: { name: string }) => chain.name === 'Localhost')!.rpcUrls.default;
      return <div id="url">{url}</div>;
    }
    const DappWagmiProvider = require('@/components/WagmiProvider').default;
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <DappWagmiProvider>{children}</DappWagmiProvider>
    );
    const { container } = render(<Test />, { wrapper });
    expect(container.querySelector('#url')!.innerHTML).toEqual('http://localhost:8545');
  });
});
/*
 * // resetModules and isolateModules do not work on WagmiConfig
describe('WagmiProvider component env', () => {
  it('url equal localhost', () => {
    const Test = () => {
      const providers = useProvider();
      const url = providers.chains!.find((chain: { name: string }) => chain.name === 'Localhost')!.rpcUrls.default;
      return <div id="url">{url}</div>;
    };
    const DappWagmiProvider = require('@/components/WagmiProvider').default;
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <DappWagmiProvider>{children}</DappWagmiProvider>
    );
    const { container } = render(<Test />, { wrapper });
    expect(container.querySelector('#url')!.innerHTML).toEqual(process.env.NEXT_PUBLIC_RPC_URL);
  });
});
*/
/*
describe('test b', () => {
  beforeAll(() => {
    jest.resetModules();
    jest.mock('react', () => jest.requireActual('react'))
    jest.mock('react-dom', () => {
      return jest.requireActual('react-dom')
    })

    jest.mock('react-dom/test-utils', () => {
      return jest.requireActual('react-dom/test-utils')
    })

    jest.mock('@testing-library/react', () => {
      return jest.requireActual('@testing-library/react')
    })
    jest.mock('wagmi', () => jest.requireActual('wagmi'))
    jest.spyOn(React, "useEffect").mockImplementation(() => {});
  });
  it('url equal localhost', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      console.log(process.env);
      const Test = () => {
        const { useProvider } = require('wagmi');
        const providers = useProvider();
        const url = providers.chains!.find((chain: { name: string }) => chain.name === 'Localhost')!.rpcUrls.default;
        return <div id="url">{url}</div>;
      }
      const DappWagmiProvider = require('@/components/WagmiProvider').default;
      const wrapper = ({ children }: { children: React.ReactElement }) => (
        <DappWagmiProvider>{children}</DappWagmiProvider>
      );
      const { container } = render(<Test />, { wrapper });
      expect(container.querySelector('#url')!.innerHTML).toEqual(process.env.NEXT_PUBLIC_RPC_URL);
  });
});
 */
