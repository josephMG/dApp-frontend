import { truncateAddress } from '@/libs/helpers';

describe('Helper TruncateAddress', () => {
  it('string length more than 10, truncate address works', () => {
    const str = '1234567890123';
    expect(truncateAddress(str)).toEqual('123456...0123');
  });
  it('string length less than 10, truncate address works', () => {
    const str = '1234567890';
    expect(truncateAddress(str)).toEqual('123456...7890');
  });
});
