const { ActionTransport } = require('@microfleet/plugin-router');

/**
 * @api {amqp} <prefix>.message.predefined Send a message using predefined account
 * @apiVersion 1.0.0
 * @apiName message.predefined
 * @apiGroup Message
 * @apiSchema {jsonschema=../../schemas/message.predefined.json} apiParam
 */
function predefinedAction(request) {
  const { account, message, to } = request.params;
  const { transport } = this.getAccount(account);

  return transport(to, message);
}

predefinedAction.schema = 'message-predefined';
predefinedAction.transports = [ActionTransport.amqp];

module.exports = predefinedAction;
