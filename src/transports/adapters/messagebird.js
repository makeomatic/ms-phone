/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
const { initClient } = require('messagebird');
const isBlacklisted = require('../../utils/blacklist-phones');

module.exports = (accountConfig) => {
  const { from, apiKey, blackList } = accountConfig;

  const client = initClient(apiKey);

  const send = (to, body) => new Promise((resolve, reject) => {
    const msgParams = { originator: from, recipients: [to], body };

    if (isBlacklisted(to, blackList)) {
      return resolve({ blackListed: true, totalSentCount: 0 });
    }

    client.messages.create(msgParams, (err, response) => {
      if (err) return reject(err);

      return resolve({ id: response.id, totalSentCount: response.recipients.totalSentCount, blackListed: false });
    });
  });

  send.client = client;

  return send;
};
