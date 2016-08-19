const _ = require('lodash');
const twilio = require('twilio');

module.exports = accountConfig => {
  const { authToken, from, sid, transportOptions } = accountConfig;
  const client = twilio(sid, authToken, transportOptions);
  const send = (to, body) => client.sendMessage({ from, to, body })
    .then(response => _.pick(response, ['sid', 'status']));

  send.client = client;

  return send;
};
