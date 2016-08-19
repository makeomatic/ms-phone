const { ActionTransport } = require('mservice');
const path = require('path');

module.exports = {
  router: {
    routes: {
      directory: path.resolve(__dirname, '../actions'),
      prefix: 'phone',
      transports: [ActionTransport.amqp],
    },
  },
};
