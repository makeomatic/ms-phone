const { getGlobalDispatcher, interceptors, request } = require('undici');

const dispatcher = getGlobalDispatcher()
  .compose(
    interceptors.retry({
      maxRetries: 3,
      minTimeout: 1000,
      maxTimeout: 10000,
    })
  );

module.exports = (accountConfig) => {
  const { type, apiKey, ...requestOptions } = accountConfig;
  const url = 'https://direct.i-dgtl.ru/api/v1/message';
  const headers = {
    authorization: `Basic ${apiKey}`,
    'content-type': 'application/json',
  };
  const method = 'POST';

  return (destination, content) => {
    const options = {
      body: JSON.stringify([{
        ...requestOptions,
        channelType: 'SMS',
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
