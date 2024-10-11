const { getGlobalDispatcher, interceptors, request } = require('undici');

const channelType = 'SMS';
const contentType = 'application/json';
const dispatcher = getGlobalDispatcher()
  .compose(
    interceptors.retry({
      maxRetries: 3,
      minTimeout: 1000,
      maxTimeout: 10000,
    })
  );
const method = 'POST';
const url = 'https://direct.i-dgtl.ru/api/v1/message';

module.exports = (accountConfig) => {
  const { type, apiKey, ...requestOptions } = accountConfig;
  const headers = {
    authorization: `Basic ${apiKey}`,
    'content-type': contentType,
  };

  return (destination, content) => {
    const options = {
      body: JSON.stringify([{
        ...requestOptions,
        channelType,
        content,
        destination,
      }]),
      dispatcher,
      headers,
      method,
    };

    return request(url, options).then(({ body }) => body.json());
  };
};
