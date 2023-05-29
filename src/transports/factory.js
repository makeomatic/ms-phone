const { HttpStatusError } = require('@microfleet/validation');
const adapters = require('./adapters');

module.exports = (accountConfig) => {
  const adapter = adapters[accountConfig.type];

  if (!adapter) {
    throw new HttpStatusError(500, `Transport ${accountConfig.type} unimplemented`);
  }

  return adapter(accountConfig);
};
