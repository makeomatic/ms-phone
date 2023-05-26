const assert = require('assert');
const { inspectPromise } = require('@makeomatic/deploy');

describe('Phone service', function serviceSuite() {
  const config = require('../configs/config');
  const PhoneService = require('../../src');

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

        const message = {
          account: 'test_account_twilio',
          message: 'test message',
          to: '+79219234781',
        };

        const response = await amqp
          .publishAndWait('phone.message.predefined', message);

        assert.ok(response.sid);
        assert.equal(response.status, 'queued');
      });
    });

    describe('"message.adhoc" action', function adhocSuite() {
      it.skip('should returns error if account options is invalid', async () => {
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

      it('should be able to send message - sandbox', async () => {
        const { amqp } = phoneService;
        const message = {
          account: {
            authToken: process.env.TEST_AUTH_TOKEN,
            from: process.env.TEST_PHONE_NUMBER,
            sid: process.env.TEST_ACCOUNT_SID,
            type: 'twilio',
          },
          message: 'test message',
          to: '+79219234781',
        };

        const response = await amqp.publishAndWait('phone.message.adhoc', message);

        assert.ok(response.sid);
        assert.equal(response.status, 'queued');
      });
    });
  });
});
