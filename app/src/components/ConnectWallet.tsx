import { useCallback, useEffect, useState } from 'react';
import Blockies from 'react-blockies';

import { makeStyles } from '@mui/styles';

import { SiweMessage } from 'siwe';
import { getCsrfToken, signIn, signOut } from 'next-auth/react';

import { useSignMessage, useAccount, useDisconnect, useConnect } from 'wagmi';
// import { useWeb3Modal } from '@/hooks/useWeb3';
import { truncateAddress } from '@/libs/helpers';

const ConnectWallet = () => {
  const classes = useStyles();
  // const [isWaiting, setWaiting] = useState(false)
  // const [isSent, setSent] = useState(false)
  // const [walletNotDetected, setWalletNotDetected] = useState(false)

  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  useEffect(() => {
    fetchNonce();
  }, []);

  const fetchNonce = async () => {
    try {
      /*
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
       */
      const nonce = await getCsrfToken();
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };
  const connectData = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClickConnect = async () => {
    try {
      const res = await connectData.connectAsync({ connector: connectData.connectors[0] });
      const callbackUrl = '/protected';

      setState((x) => ({ ...x, loading: true }));
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: res.chain?.id,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn('credentials', { message: JSON.stringify(message), redirect: false, signature, callbackUrl });
      // Create SIWE message with pre-fetched nonce and sign with wallet

      // Verify signature
      /*
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error('Error verifying message');
       */

      setState((x) => ({ ...x, loading: false }));
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      fetchNonce();
    }
  };

  const handleClickAddress = useCallback(async () => {
    disconnect();
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <button
      className={classes.btn}
      disabled={!state.nonce || state.loading}
      onClick={address ? handleClickAddress : handleClickConnect}
    >
      <Blockies className={classes.img} seed={address?.toLowerCase() || ''} size={8} scale={3} />
      <div>{address ? truncateAddress(address) : 'Connect Wallet'}</div>
    </button>
  );
};

const useStyles = makeStyles((_theme) => ({
  btn: {
    background: 'rgb(183,192,238)',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 9999,
    height: 35,
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    borderRadius: 999,
    marginRight: 5,
  },
}));

export default ConnectWallet;
