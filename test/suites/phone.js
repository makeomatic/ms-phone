const assert = require('assert');
const config = require('../configs/config');
const PhoneService = require('../../src');
const sendMessageResponse = require('../fixtures/send-message-response');
const sinon = require('sinon');
const adapters = require('../../src/transports/adapters');

describe('Phone service', function serviceSuite() {
  const phoneService = new PhoneService(config);

  before('start up service', () => phoneService.connect());

  describe('with "twilio" provider', function twilioSuite() {
    describe('"message.predefined" action', function predefinedSuite() {
      it('should returns error if account name is invalid', () => {
        const { amqp } = phoneService;
        const message = {
          account: 'invalid_account',
          message: 'test message',
          to: '+79219234781',
        };

        return amqp.publishAndWait('phone.message.predefined', message)
            .reflect()
            .then(inspection => {
              assert.strictEqual(inspection.isFulfilled(), false);
              assert.deepStrictEqual(
                inspection.error().message,
                'Not Found: \"Account invalid_account\"' // eslint-disable-line no-useless-escape
              );
            });
      });

      it('should be able to send message', () => {
        const { amqp } = phoneService;
        const { client } = phoneService.getAccount('test_account').transport;
        const stub = sinon.stub(client, 'sendMessage');
        const message = {
          account: 'test_account',
          message: 'test message',
          to: '+79219234781',
        };
        const args = {
          body: 'test message',
          from: '+1 201-559-5555',
          to: '+79219234781',
        };

        stub.withArgs(args).returns(Promise.resolve(sendMessageResponse));

        return amqp.publishAndWait('phone.message.predefined', message)
            .reflect()
            .then(inspection => {
              const response = {
                sid: 'SMc7f49c7a2b1f483d9f56c8f52863c1ca',
                status: 'queued',
              };

              assert.strictEqual(inspection.isFulfilled(), true);
              assert.deepStrictEqual(inspection.value(), response);
              stub.restore();
            });
      });
    });

    describe('"message.adhoc" action', function adhocSuite() {
      it('should returns error if account options is invalid', () => {
        const { amqp } = phoneService;
        const message = {
          account: {
            from: '+1 201-559-5555',
            sid: 'ACa35f1e868cead4f1b3a31c6620000000',
            type: 'invalid_type',
          },
          message: 'test message',
          to: '+79219234781',
        };

        return amqp.publishAndWait('phone.message.adhoc', message)
            .reflect()
            .then(inspection => {
              assert.strictEqual(inspection.isFulfilled(), false);
              assert.deepStrictEqual(inspection.error().message, 'message-adhoc validation' +
                ' failed: data.account should have required property \'authToken\',' +
                ' data.account.type should be equal to constant, data.account should match' +
                ' exactly one schema in oneOf');
            });
      });

      it('should be able to send message', () => {
        const { amqp } = phoneService;
        const stub = sinon.stub(adapters, 'twilio');
        const message = {
          account: {
            authToken: '<AUTH_TOKEN>',
            from: '+1 201-559-5555',
            sid: 'ACa35f1e868cead4f1b3a31c6620000000',
            type: 'twilio',
          },
          message: 'test message',
          to: '+79219234781',
        };
        const actionResponse = {
          sid: 'SMc7f49c7a2b1f483d9f56c8f52863c1ca',
          status: 'queued',
        };

        stub.withArgs(message.account).returns(() => Promise.resolve(actionResponse));

        return amqp.publishAndWait('phone.message.adhoc', message)
            .reflect()
            .then(inspection => {
              const response = {
                sid: 'SMc7f49c7a2b1f483d9f56c8f52863c1ca',
                status: 'queued',
              };

              assert.strictEqual(inspection.isFulfilled(), true);
              assert.deepStrictEqual(inspection.value(), response);
              stub.restore();
            });
      });
    });
  });
});
