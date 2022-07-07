import { ReactElement } from 'react';
import { chain, WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi';
/*
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
 */
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

interface WagmiProviderProps {
  children: ReactElement[] | ReactElement | string;
}

/*
const { chains, provider, webSocketProvider } = configureChains([...defaultChains, chain.hardhat], [publicProvider()]);
 */
const { chains, provider, webSocketProvider } = configureChains(
  [chain.hardhat, chain.localhost, ...defaultChains],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
      }),
    }),
    publicProvider(),
  ]
);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    /*
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
     */
  ],
  provider,
  webSocketProvider,
});

const DappWagmiProvider = ({ children }: WagmiProviderProps): ReactElement => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
);

export default DappWagmiProvider;
