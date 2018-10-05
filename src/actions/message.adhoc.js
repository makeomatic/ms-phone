const { ActionTransport } = require('@microfleet/core');
const transportFactory = require('../transports/factory');

/**
 * @api {amqp} <prefix>.message.adhoc Send a message
 * @apiVersion 1.0.0
 * @apiName message.adhoc
 * @apiGroup Message
 * @apiSchema {jsonschema=../../schemas/message.adhoc.json} apiParam
 */
function adhocAction(request) {
  const { account, message, to } = request.params;
  const transport = transportFactory(account);

  return transport(to, message);
}

adhocAction.schema = 'message-adhoc';
adhocAction.transports = [ActionTransport.amqp];

module.exports = adhocAction;
