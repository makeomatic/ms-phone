const { resolve } = require('path');
const { Store } = require('ms-conf');

// default to "MS_MAILER"
process.env.NCONF_NAMESPACE = process.env.NCONF_NAMESPACE || 'MS_PHONE';

module.exports = async function getStore(defaultOpts) {
  const store = new Store({ defaultOpts });

  store.prependDefaultConfiguration(resolve(__dirname, './configuration'));
  await store.ready();

  return store;
};
