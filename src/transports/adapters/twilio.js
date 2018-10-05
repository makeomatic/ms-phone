const pick = require('lodash.pick');
const twilio = require('twilio');

module.exports = (accountConfig) => {
  const { authToken, from, sid, transportOptions } = accountConfig;

  const client = twilio(sid, authToken, transportOptions);
  const send = (to, body) => (
    client
      .sendMessage({ from, to, body })
      .then(response => pick(response, ['sid', 'status']))
  );

  send.client = client;

  return send;
};
