const _ = require('lodash');
const { globFiles } = require('ms-conf/lib/load-config');
const Errors = require('common-errors');
const is = require('is');
const MService = require('mservice');
const path = require('path');
const transportFactory = require('./transports/factory');

const defaultConfig = globFiles(path.resolve(__dirname, 'configs'));

class Phone extends MService {
  constructor(config = {}) {
    super(_.merge({}, defaultConfig, config));
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
    }, {});
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
