/* eslint-disable  @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http';
import https from 'https';
import qs from 'qs';
const agent = new https.Agent({
  rejectUnauthorized: false,
});

async function parseStatus(res: Response): Promise<Record<string, unknown>> {
  const { status, ok } = res;
  const data = await res.json();
  /*
  if (status >= 200 && status < 300) {
    return messages;
  }
  */
  return { statusCode: status, ok, ...data };
}

function requestHeaders(customHeaders: IncomingHttpHeaders): IncomingHttpHeaders {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // headers = Object.assign({}, headers, customHeaders);
  headers = { ...headers, ...customHeaders };
  return headers;
}

/*
function queryString(body) {
  return Object.keys(body).map(key => `${key}=${body[key]}`).join("&");
}
*/

export default async (url: string, method = 'GET', { dataObj = {}, headers = {} } = {}): Promise<any> => {
  let options = {
    method,
    headers: requestHeaders(headers) as HeadersInit,
  };

  let path = /(http(s?)):\/\//i.test(url) ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  if (method !== 'GET') {
    options = Object.assign(options, { body: dataObj instanceof FormData ? dataObj : JSON.stringify(dataObj) });
  } else {
    const params = typeof dataObj === 'string' ? dataObj : typeof dataObj === 'object' ? qs.stringify(dataObj) : '';
    path += path.indexOf('?') === -1 && params !== '' ? `?${params}` : params;
    // options = Object.assign(options, { params: dataObj });
  }
  if (process.env.NODE_ENV === 'development') {
    options = Object.assign(options, { agent });
  }

  const res = await fetch(path, options);
  return parseStatus(res);
};
