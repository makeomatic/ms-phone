const { ActionTransport, routerExtension } = require('@microfleet/core');
const path = require('path');

exports.router = {
  routes: {
    directory: path.join(__dirname, '../actions'),
    prefix: 'phone',
    setTransportsAsDefault: false,
    transports: [ActionTransport.amqp, ActionTransport.http],
    enabledGenericActions: [
      'health',
    ],
  },
  extensions: {
    enabled: ['postRequest', 'preRequest', 'preResponse', 'postResponse'],
    register: [
      routerExtension('validate/schemaLessAction'),
      routerExtension('audit/log')(),
      routerExtension('audit/metrics')(),
    ],
  },
};
