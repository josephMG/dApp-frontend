/* eslint-disable */
import '@testing-library/jest-dom/extend-expect';
import { loadEnvConfig } from '@next/env';
import { enableFetchMocks } from 'jest-fetch-mock';
import 'jest-canvas-mock';

loadEnvConfig(process.cwd());

enableFetchMocks();
/*
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  })
) as jest.Mock;
*/
