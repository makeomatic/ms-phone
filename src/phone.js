const merge = require('lodash.merge');
const { Microfleet } = require('@microfleet/core');
const { HttpStatusError } = require('@microfleet/validation');
const getStore = require('./config');
const transportFactory = require('./transports/factory');

class Phone extends Microfleet {
  constructor(config = {}) {
    super(config);
    this.initAccounts();
  }

  initAccounts() {
    const { accounts } = this.config.phone;

    this._accounts = Object.keys(accounts).reduce((previous, accountName) => {
      const account = accounts[accountName];
      previous[accountName] = {
        config: account,
        transport: transportFactory(account),
      };

      return previous;
    }, Object.create(null));
  }

  getAccount(name) {
    const account = this._accounts[name];

    if (!account) {
      throw new HttpStatusError(404, `Account ${name} not found`);
    }

    return account;
  }

  async getHealthStatus() {
    try {
      const status = await super.getHealthStatus();
      this.log.debug({ status }, 'health');
      return status;
    } catch (err) {
      this.log.error({ err }, 'failed healthcheck');
      throw err;
    }
  }
}

exports.init = async function initPhone(defaultOpts = {}) {
  const store = await getStore({ env: process.env.NODE_ENV });
  const config = store.get('/');

  return new Phone(merge({}, config, defaultOpts));
};

exports.Phone = Phone;
