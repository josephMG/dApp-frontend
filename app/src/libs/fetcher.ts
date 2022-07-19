/* eslint-disable  @typescript-eslint/no-explicit-any */
import https from 'https';
import qs from 'qs';
const agent = new https.Agent({
  rejectUnauthorized: false,
});

async function parseStatus(status: number, res: Promise<any>): Promise<Record<string, unknown>> {
  const messages = await res;
  /*
  if (status >= 200 && status < 300) {
    return messages;
  }
  */
  return { statusCode: status, data: messages };
}

function requestHeaders(customHeaders: HeadersInit): HeadersInit {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  headers = Object.assign({}, headers, customHeaders);
  return headers;
}

/*
function queryString(body) {
  return Object.keys(body).map(key => `${key}=${body[key]}`).join("&");
}
*/

export default async (url: string, method = 'GET', { dataObj = {}, headers = new Headers() } = {}): Promise<any> => {
  let options = {
    method,
    headers: requestHeaders(headers),
  };

  let path = url;
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
  return parseStatus(res.status, res.json());
};
