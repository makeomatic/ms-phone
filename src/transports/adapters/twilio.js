const { Twilio } = require('twilio');

module.exports = (accountConfig) => {
  const { authToken, from, sid, transportOptions } = accountConfig;

  const client = new Twilio(sid, authToken, transportOptions);
  const send = (to, body) => (
    client
      .api
      .account
      .messages
      .create({ from, to, body })
      .then((response) => ({
        sid: response.sid,
        status: response.status,
      }))
  );

  send.client = client;

  return send;
};
