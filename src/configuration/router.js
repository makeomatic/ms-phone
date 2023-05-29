const { Extensions } = require('@microfleet/plugin-router');
const path = require('path');

/**
 * @type { import('@microfleet/plugin-router').RouterPluginConfig }
 */
exports.router = {
  routes: {
    directory: path.join(__dirname, '../actions'),
    prefix: 'phone',
    enabledGenericActions: ['health'],
  },
  extensions: {
    register: [Extensions.auditLog()],
  },
};
