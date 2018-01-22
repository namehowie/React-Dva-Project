import fetch from 'dva/fetch';
import urlConfig from '../resource/urlZxnl.json'

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if ((response.status >= 200) && (response.status < 300)) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
let myHeaders = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain'
    // 'authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJhdXRoIjpbeyJhdXRob3JpdHkiOiIvdGVhY2hlciJ9LHsiYXV0aG9yaXR5IjoiL3RlYWNoZXIvcGFnZSJ9XSwic3ViIjoieHVlaCIsImp0aSI6IjIyOTc1In0.KUKh3AfhAPO6lYiio_1HTUIN7WKLv8iiNC67WpFvnjVbNnHcg6yCMcrF-F8Pnvhz_YuO47TMm_ZIbI3apZW9Aw'
});
var  options = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors'
    }
export default function request(url, options) {
  return fetch(_getRequestUrl(url), options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(err => ({err}));
}

function _getRequestUrl(apiUrl) {
  let items = apiUrl.split('?');
  return  urlConfig.basePath + urlConfig[items[0]]['url'] + (items.length == 2 ? '?' + items[1] : '')
}
