const Errors = require('common-errors');
const is = require('is');
const adapters = require('./adapters');

module.exports = accountConfig => {
  const adapter = adapters[accountConfig.type];

  if (is.undefined(adapter) === true) {
    throw new Errors.NotImplementedError(`Transport ${accountConfig.type}`);
  }

  return adapter(accountConfig);
};
