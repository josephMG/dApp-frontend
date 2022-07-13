// you want to import from test-utils instead of testing-library/react since we overwrote the render function to support our wrapper providers
import React from 'react';
import { act, fireEvent, render, screen } from 'tests/test-utils';
import ConnectWallet from '@/components/ConnectWallet';
// mport { CtxOrReq } from 'next-auth/client/_utils';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useConnect, useAccount } from 'wagmi';

const mockUseConnect = {
  connectAsync: jest.fn(() => ({ account: 'bbbbb' })),
  connectors: ['abc']
};
const mockUseSignMessage = {
  signMessageAsync: jest.fn(() => Promise.resolve('success')),
}
const mockUseAccount = {
  address: ''
}
const mockUseDisconnect = {
  disconnect: jest.fn(),
}

jest.mock('wagmi', () => {
  const Wagmi = jest.requireActual('wagmi');
  return {
    ...Wagmi,
    useConnect: () => mockUseConnect,
    useSignMessage: () => mockUseSignMessage,
    useAccount: jest.fn(() => mockUseAccount),
    useDisconnect: () => mockUseDisconnect
  }
})
jest.mock('siwe', () => {
  const Siwe = jest.requireActual('siwe')
  return {
    ...Siwe,
    SiweMessage: jest.fn().mockImplementation(
      () => ({
        prepareMessage: jest.fn()
      })
    )
  };
});
jest.mock('next-auth/react', () => {
  const NextAuth = jest.requireActual('next-auth/react')
  return {
    ...NextAuth,
    getCsrfToken: jest.fn(),
    signIn: jest.fn()
  };
});
/*
interface StateInterface {
  loading?: boolean;
  nonce?: string;
}
*/
describe('ConnectWallet component', () => {
  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }), { status: 200 });
    (getCsrfToken as jest.Mock).mockImplementation(() => Promise.resolve('abc'));
    (signIn as jest.Mock).mockImplementation(() => jest.fn())
    // to fully reset the state between tests, clear the storage
    // and reset all mocks
  });
  afterEach(() => {
    jest.resetModules();
  });

  it('should render without errors', async () => {
    await act(async () => {
      render(<ConnectWallet />);
    })
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });
  it('fetchNonce should catch', async () => {
    (getCsrfToken as jest.Mock).mockImplementation(() => Promise.reject(new Error('num should not exist')))
    const stateSetter = jest.fn()
    const spyUseState = jest.spyOn(React, 'useState')
    spyUseState.mockImplementation(() => [{}, stateSetter] as any)
    await act(async () => {
      render(<ConnectWallet />);
    })
    // expect(getCsrfToken(1)).rejects.toThrow('num should not exist')a
    try {
      await getCsrfToken()
    } catch (error) {
      expect(error).toEqual(new Error('num should not exist'))
    }
  });
  it('handle connect click', async () => {
    await act(async () => {
      render(<ConnectWallet />);
    })
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    })
    expect(mockUseConnect.connectAsync).toBeCalled()
    expect(mockUseConnect.connectAsync).toBeCalledWith({ connector: 'abc' });
    expect(mockUseSignMessage.signMessageAsync).toBeCalled()
  });

  it('handle connect click catch', async () => {
    const connectData = useConnect();
    (connectData.connectAsync as jest.Mock).mockImplementation(() => Promise.reject(new Error('handle connect click catch')))
    connectData.connectors.pop();
    await act(async () => {
      render(<ConnectWallet />);
    })
    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    })
    try {
      await connectData.connectAsync({ connector: connectData.connectors[0] })
    } catch (error) {
      expect(error).toEqual(new Error('handle connect click catch'))
    }
  });

  it('handle address (disconnect) click', async () => {
    (useAccount as jest.Mock).mockImplementation(() => ({ address: '1234567890' }))
    await act(async () => {
      render(<ConnectWallet />);
    })

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('123456...7890')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    })
  });
});
