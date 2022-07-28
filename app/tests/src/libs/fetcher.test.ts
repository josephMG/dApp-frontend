import fetcher from '@/libs/fetcher';
import FormData from 'form-data';

describe('Fetcher libs', () => {
  const OLD_ENV = process.env;
  beforeAll(() => {
    jest.resetModules()
    fetchMock.resetMocks()
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe('Method GET', () => {
    it('success', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }), { status: 200 });
      const data = await fetcher('/first_test');
      expect(data.statusCode).toEqual(200);
      expect(data.ok).toEqual(true);
      expect(data).toMatchObject({ a: 1 });
    });

    it('success with http path', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }), { status: 200 });
      const data = await fetcher('http://example.com/http_path');
      const [url] = fetchMock.mock.lastCall;
      expect(fetch).toBeCalled();
      expect(url).toEqual('http://example.com/http_path');
      expect(data.statusCode).toEqual(200);
      expect(data.ok).toEqual(true);
      expect(data).toMatchObject({ a: 1 });
    });

    it('success with different dataObj types', async () => {
      fetchMock.mockResponse(JSON.stringify({ a: 1 }), { status: 200 });
      // typeof dataObj === string
      // a.k.a path.indexOf('?') === -1 && params !== ''
      let data = await fetcher('/first_test', 'GET', { dataObj: 'abc=3' });
      expect(data.statusCode).toEqual(200);
      expect(data.ok).toEqual(true);
      expect(data).toMatchObject({ a: 1 });

      // typeof dataObj !== string && typeof dataObj !== object
      // a.k.a params === ''
      data = await fetcher('/first_test', 'GET', { dataObj: 123 });
      expect(data.statusCode).toEqual(200);
      expect(data.ok).toEqual(true);
      expect(data).toMatchObject({ a: 1 });
    });
    it('env development should include agent', async () => {
      process.env = { ...OLD_ENV, NODE_ENV: 'development' };
      fetchMock.mockResponseOnce(JSON.stringify({ b: 1 }), { status: 200 });
      await fetcher('/include_agent');
      const [url] = fetchMock.mock.lastCall;
      expect(fetch).toBeCalled();
      expect(url).toEqual(`${process.env.NEXT_PUBLIC_BACKEND_URL}/include_agent`)
      /*
      expect(Object.keys(options as { [key: string]: any })).toContain('agent');
      */
    });
  })

  describe('Method POST', () => {
    it('Post empty json', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ c: 1 }), { status: 200 });
      await fetcher('/third_test', 'POST', { dataObj: { key: 1 } });
      const [, options] = fetchMock.mock.lastCall;
      expect(fetch).toBeCalled();
      expect(options!.body).toEqual('{"key":1}');
    });
    it('Post empty json', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ c: 1 }), { status: 200 });
      let formData = new FormData();
      formData.append('name', 'John');
      await fetcher('/third_test', 'POST', {
        headers: {
          'Content-Type': "application/x-www-form-urlencoded",
        },
        dataObj: formData,
      });
      const [, options] = fetchMock.mock.lastCall;
      expect(fetch).toBeCalled();
      expect(options!.headers).toMatchObject({ 'Content-Type': 'application/x-www-form-urlencoded' });
      const reqBody = options!.body!;
      expect(reqBody instanceof FormData).toEqual(true);
    });
  })
});
