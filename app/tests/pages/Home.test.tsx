// you want to import from test-utils instead of testing-library/react since we overwrote the render function to support our wrapper providers
import React from 'react'
import { clear } from 'use-between'
import { act, fireEvent, render, screen } from '../test-utils';
import Home, { getServerSideProps } from 'pages/index';
import { tools } from '@/libs/tools';

describe('Home page', () => {
  beforeEach(() => {
    jest.resetModules()
    fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }), { status: 200 });
    // to fully reset the state between tests, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();
  });
  afterEach(() => {
    clear();
  });

  it('should render without errors', async () => {
    act(() => {
      render(<Home tools={tools.map(({ name, image }) => ({ name, image }))} />);
    })
    // tools header
    expect(screen.getByRole('heading', { name: 'Next.js Web3 starter' })).toBeInTheDocument();
    // array of tools
    expect(screen.getAllByRole('listitem').length).toEqual(tools.length);
    expect(screen.getAllByRole('link').length).toEqual(tools.length);
    expect(screen.getAllByRole('link').length).toEqual(tools.length);

    const firstTool = screen.getAllByRole('listitem')[0];
    // Semantics check of 'link button' is anchor tag to tool page ( Accessibility test )
    expect(firstTool.querySelector('a')).toBeInTheDocument();
    // image
    expect(firstTool.querySelector('img')).toBeInTheDocument();
    // name
    // @ts-ignore
    expect(firstTool.querySelector('p', { name: tools[0].name })).toBeInTheDocument();
  });

  it('should change darkmode', async () => {
    act(() => {
      render(<Home tools={tools.map(({ name, image }) => ({ name, image }))} />);
    })
    expect(screen.getAllByTestId('Brightness4OutlinedIcon').length).toEqual(1);

    const button = screen.getByLabelText('mode');
    fireEvent.click(button);
    expect(screen.getAllByTestId('Brightness5OutlinedIcon').length).toEqual(1);
  });

  it('should render localstorage lightmode', async () => {
    act(() => {
      localStorage.setItem('mode', '1');
      render(<Home tools={tools.map(({ name, image }) => ({ name, image }))} />);
    })
    expect(screen.getAllByTestId('Brightness5OutlinedIcon').length).toEqual(1);
  });

  it('should render localstorage darkmode', async () => {
    act(() => {
      localStorage.setItem('mode', '0');
      render(<Home tools={tools.map(({ name, image }) => ({ name, image }))} />);
    })
    expect(screen.getAllByTestId('Brightness4OutlinedIcon').length).toEqual(1);
  });

  it('serverSideProps', async () => {
    // @ts-ignore
    const response = await getServerSideProps();
    expect(response).toEqual({
      props: {
        tools: tools.map(({ name, image }) => ({
          name,
          image,
        })),
      },
    });
  });
});
