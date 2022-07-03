import { useEffect, useState } from 'react';
import Blockies from 'react-blockies';

import { makeStyles } from '@mui/styles';

import { useWeb3Modal } from '../hooks/useWeb3';

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};

const ConnectWallet = () => {
  const classes = useStyles();

  const [signerAddress, setSignerAddress] = useState('');
  // const [isWaiting, setWaiting] = useState(false)
  // const [isSent, setSent] = useState(false)
  // const [walletNotDetected, setWalletNotDetected] = useState(false)

  const { connectWallet, disconnectWallet, provider } = useWeb3Modal();

  useEffect(() => {
    const getAddress = async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signer = provider!.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(address);
    };
    if (provider) getAddress();
    else setSignerAddress('');
  }, [provider]);

  const handleClickConnect = async () => {
    await connectWallet();
  };

  const handleClickAddress = () => {
    disconnectWallet();
  };

  return (
    <button className={classes.btn} onClick={signerAddress ? handleClickAddress : handleClickConnect}>
      <Blockies className={classes.img} seed={signerAddress.toLowerCase()} size={8} scale={3} />
      <div>{signerAddress ? truncateAddress(signerAddress) : 'Connect Wallet'}</div>
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
