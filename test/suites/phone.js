const assert = require('assert');
const sinon = require('sinon');
const { inspectPromise } = require('@makeomatic/deploy');

describe('Phone service', function serviceSuite() {
  const config = require('../configs/config');
  const PhoneService = require('../../src');
  const sendMessageResponse = require('../fixtures/send-message-response');
  const adapters = require('../../src/transports/adapters');

  const phoneService = new PhoneService(config);

  before('start up service', () => phoneService.connect());
  after('close service', () => phoneService.close());

  describe('with "twilio" provider', function twilioSuite() {
    describe('"message.predefined" action', function predefinedSuite() {
      it('should returns error if account name is invalid', async () => {
        const { amqp } = phoneService;
        const message = {
          account: 'invalid_account',
          message: 'test message',
          to: '+79219234781',
        };

        const error = await amqp
          .publishAndWait('phone.message.predefined', message)
          .reflect()
          .then(inspectPromise(false));

        assert.deepStrictEqual(error.message, 'Not Found: "Account invalid_account"');
      });

      it('should be able to send message', async () => {
        const { amqp } = phoneService;
        const { client } = phoneService.getAccount('test_account').transport;
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

        const stub = sinon.stub(client, 'sendMessage');
        stub.withArgs(args).resolves(sendMessageResponse);

        try {
          const response = await amqp
            .publishAndWait('phone.message.predefined', message);

          assert.deepStrictEqual(response, {
            sid: 'SMc7f49c7a2b1f483d9f56c8f52863c1ca',
            status: 'queued',
          });
        } finally {
          stub.restore();
        }
      });
    });

    describe('"message.adhoc" action', function adhocSuite() {
      it('should returns error if account options is invalid', async () => {
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

        const error = await amqp.publishAndWait('phone.message.adhoc', message)
          .reflect()
          .then(inspectPromise(false));

        assert.deepStrictEqual(error.message, 'message-adhoc validation'
            + ' failed: data.account should have required property \'authToken\','
            + ' data.account.type should be equal to constant, data.account should match'
            + ' exactly one schema in oneOf');
      });

      it('should be able to send message', async () => {
        const { amqp } = phoneService;
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

        const stub = sinon.stub(adapters, 'twilio');
        stub.withArgs(message.account).returns(async () => actionResponse);

        try {
          const response = await amqp.publishAndWait('phone.message.adhoc', message);
          assert.deepStrictEqual(response, {
            sid: 'SMc7f49c7a2b1f483d9f56c8f52863c1ca',
            status: 'queued',
          });
        } finally {
          stub.restore();
        }
      });
    });
  });
});
