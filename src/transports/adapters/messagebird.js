const { initClient } = require('messagebird');

module.exports = (accountConfig) => {
  const { from, apiKey } = accountConfig;

  const client = initClient(apiKey);
  const recipients = [];

  // eslint-disable-next-line promise/no-native
  const send = (to, body) => new Promise((resolve, reject) => {
    recipients.push(to);
    const msgParams = { originator: from, recipients, body };

    client.messages.create(msgParams, (err, response) => {
      if (err) return reject(err);

      return resolve({ id: response.id, totalSentCount: response.recipients.totalSentCount });
    });
  });

  send.client = client;

  return send;
};
