const twilio = require('./adapters/twilio');
const messagebird = require('./adapters/messagebird');
const iDgtl = require('./adapters/i-dgtl');

module.exports = {
  twilio,
  messagebird,
  'i-dgtl': iDgtl,
};
