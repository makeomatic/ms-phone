const Mservice = require('@microfleet/core');
const path = require('path');

exports.router = {
  routes: {
    directory: path.join(__dirname, '../actions'),
    prefix: 'phone',
    setTransportsAsDefault: true,
    transports: [Mservice.ActionTransport.amqp],
  },
  extensions: {
    enabled: ['postRequest', 'preRequest', 'preResponse'],
    register: [
      Mservice.routerExtension('validate/schemaLessAction'),
      Mservice.routerExtension('audit/log'),
    ],
  },
};
