import axios from 'axios';

export function simpleRequest(endpoint, payload, method) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const opts = {
    url: endpoint,
    method,
    data: JSON.stringify(payload),
    headers,
  };

  return axios(opts)
    .then((resp) => {
      if (resp.status !== 200) {
        throw resp;
      } else {
        return resp.data;
      }
    })
    .then((json) => {
      return Promise.resolve(json);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
      return Promise.reject(error);
    });
}
