const merge = require('lodash.merge');
const Errors = require('common-errors');
const is = require('is');
const { Microfleet } = require('@microfleet/core');
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

    if (is.undefined(account) === true) {
      throw new Errors.NotFoundError(`Account ${name}`);
    }

    return account;
  }

  async getHealthStatus() {
    try {
      const status = await super.getHealthStatus();
      this.log.info(status);
      return status;
    } catch (err) {
      this.log.error(err);
      throw err;
    }
  }
}

module.exports = async function initPhone(defaultOpts = {}) {
  const store = await getStore({ env: process.env.NODE_ENV });
  const config = store.get('/');

  return new Phone(merge({}, config, defaultOpts));
};

module.exports = Phone;
