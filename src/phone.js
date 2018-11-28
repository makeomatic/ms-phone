const merge = require('lodash.merge');
const Errors = require('common-errors');
const is = require('is');
const { Microfleet } = require('@microfleet/core');
const conf = require('./config');
const transportFactory = require('./transports/factory');

class Phone extends Microfleet {
  static defaultConfig = conf.get('/', { env: process.env.NODE_ENV });

  constructor(config = {}) {
    super(merge({}, Phone.defaultConfig, config));
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
}

module.exports = Phone;
