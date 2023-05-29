/**
 * @type { import('@microfleet/plugin-amqp').AMQPPluginConfig }
 */
exports.amqp = {
  transport: {
    connection: {
      host: 'rabbitmq',
      port: 5672,
    },
  },
};

exports.routerAmqp = {

};
