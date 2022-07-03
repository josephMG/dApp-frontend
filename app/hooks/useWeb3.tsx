import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import useThemeMode from './useThemeMode';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '12122222222',
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'kovan',
  cacheProvider: true,
  providerOptions,
});

export function useWeb3Modal() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useThemeMode();

  useEffect(() => {
    const updateWeb3Theme = async () => {
      await web3Modal.updateTheme(1 - darkMode ? 'light' : 'dark');
    };
    updateWeb3Theme();
  }, [darkMode]);

  if (web3Modal.cachedProvider && !provider) {
    connectWallet();
  }

  async function connectWallet() {
    try {
      const externalProvider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(externalProvider);

      setProvider(ethersProvider);
    } catch (e) {
      setError('NO_WALLET_CONNECTED');
      console.log('NO_WALLET_CONNECTED', e);
    }
  }

  function disconnectWallet() {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
  }

  return { connectWallet, disconnectWallet, provider, error };
}
