const { getGlobalDispatcher, interceptors, request } = require('undici');

module.exports = (accountConfig) => async (to, body) => {
  const { type, apiUrl, apiKey, ...requestOptions } = accountConfig;
  const requestBody = [{
    ...requestOptions,
    channelType: 'SMS',
    content: body,
    destination: to,
  }];

  const response = await request('https://direct.i-dgtl.ru/api/v1/message', {
    body: JSON.stringify(requestBody),
    dispatcher: getGlobalDispatcher()
      .compose(
        interceptors.retry({
          maxRetries: 3,
          minTimeout: 1000,
          maxTimeout: 10000,
        })
      ),
    headers: {
      authorization: `Basic ${apiKey}`,
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  return response.body.json();
};
