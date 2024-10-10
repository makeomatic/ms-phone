const assert = require('assert');
const sinon = require('sinon');
const { MockAgent, setGlobalDispatcher } = require('undici');

const preparePhoneService = require('../../src');

describe('Phone service', function serviceSuite() {
  let phoneService;
  let messagebirdAccount;

  before('start up service', async () => {
    phoneService = await preparePhoneService();
    await phoneService.connect();

    messagebirdAccount = phoneService.getAccount('test_account_messagebird');
  });

  after('close service', async () => {
    await phoneService.close();
  });

  describe('with "twilio" provider', function twilioSuite() {
    describe('"message.predefined" action', function predefinedSuite() {
      it('should returns error if account name is invalid', async () => {
        const { amqp } = phoneService;
        const message = {
          account: 'invalid_account',
          message: 'test message',
          to: '+79219234781',
        };

        await assert.rejects(
          amqp.publishAndWait('phone.message.predefined', message),
          'Not Found: "Account invalid_account"'
        );
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

        await assert.rejects(
          amqp.publishAndWait('phone.message.adhoc', message),
          'message-adhoc validation'
          + ' failed: data.account should have required property \'authToken\','
          + ' data.account.type should be equal to constant, data.account should match'
          + ' exactly one schema in oneOf'
        );
      });

      it('should be able to send message - sandbox', async () => {
        const { amqp } = phoneService;
        const message = {
          account: {
            authToken: process.env.TEST_AUTH_TOKEN,
            from: process.env.TEST_PHONE_NUMBER_TWILIO,
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

  describe('with "messagebird" provider', function messagebirdSuite() {
    let sandbox;
    let messagebirdMessageClient;

    before(() => {
      sandbox = sinon.createSandbox();
      messagebirdMessageClient = messagebirdAccount.transport.client.messages;
      sandbox.spy(messagebirdMessageClient, 'create');
    });

    afterEach(() => {
      sandbox.resetHistory();
    });

    it('should be able to send message on "message.predefined" action', async () => {
      const { amqp } = phoneService;
      const message = {
        account: 'test_account_messagebird',
        message: 'predefined test message',
        to: '+19219234781',
      };

      const response = await amqp.publishAndWait('phone.message.predefined', message);

      sandbox.assert.calledOnce(messagebirdMessageClient.create);

      const [{ recipients }] = messagebirdMessageClient.create.getCall(0).args;
      assert.equal(message.to, recipients);

      assert(response.id);
      assert.equal(response.totalSentCount, 1);
      assert.equal(response.blackListed, false);
    });

    it('should be able to send message on "message.adhoc" action', async () => {
      const { amqp } = phoneService;
      const message = {
        account: {
          apiKey: process.env.TEST_API_KEY_MESSAGE_BIRD,
          from: process.env.TEST_PHONE_NUMBER_MESSAGEBIRD,
          type: 'messagebird',
        },
        message: 'adhoc test message',
        to: '+19219234781',
      };

      const response = await amqp.publishAndWait('phone.message.adhoc', message);

      assert(response.id);
      assert.equal(response.totalSentCount, 1);
      assert.equal(response.blackListed, false);
    });

    it('should not send message to blacklisted phones', async () => {
      const { amqp } = phoneService;
      const message = {
        account: 'test_account_messagebird',
        message: 'predefined test message',
        to: '+79219234781',
      };

      const response = await amqp.publishAndWait('phone.message.predefined', message);

      sandbox.assert.notCalled(messagebirdMessageClient.create);

      assert.equal(response.totalSentCount, 0);
      assert.equal(response.blackListed, true);
    });
  });

  describe('with "i-dgtl" provider', () => {
    const mockAgent = new MockAgent();
    setGlobalDispatcher(mockAgent);
    const mockPool = mockAgent.get('https://direct.i-dgtl.ru');

    it('should be able to send message on "message.predefined" action', async () => {
      mockPool
        .intercept({
          path: '/api/v1/message',
          method: 'POST',
          headers: {
            authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
            'content-type': 'application/json',
          },
          body: JSON.stringify([{
            senderName: 'sms_promo',
            channelType: 'SMS',
            content: 'predefined test message',
            destination: '+15551234567',
          }]),
        })
        .reply(200, {
          errors: false,
          items: [{
            code: 201,
            messageUuid: '063474ec-a34f-4558-90c5-984395000004',
          }],
        });

      const { amqp } = phoneService;
      const message = {
        account: 'test_account_iDgtl',
        message: 'predefined test message',
        to: '+15551234567',
      };

      const response = await amqp.publishAndWait('phone.message.predefined', message);

      assert.deepStrictEqual(response, {
        errors: false,
        items: [{
          code: 201,
          messageUuid: '063474ec-a34f-4558-90c5-984395000004',
        }],
      });
    });

    it('should be able to send message on "message.adhoc" action', async () => {
      mockPool
        .intercept({
          path: '/api/v1/message',
          method: 'POST',
          headers: {
            authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
            'content-type': 'application/json',
          },
          body: JSON.stringify([{
            externalMessageId: 'id123',
            senderName: 'sms_cat',
            channelType: 'SMS',
            content: 'adhoc test message',
            destination: '+15551234567',
          }]),
        })
        .reply(200, {
          errors: false,
          items: [{
            code: 201,
            externalMessageId: 'id123',
            messageUuid: '063474ec-a34f-4558-90c5-984395000004',
          }],
        });

      const { amqp } = phoneService;
      const message = {
        account: {
          apiKey: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
          externalMessageId: 'id123',
          senderName: 'sms_cat',
          type: 'i-dgtl',
        },
        message: 'adhoc test message',
        to: '+15551234567',
      };

      const response = await amqp.publishAndWait('phone.message.adhoc', message);

      assert.deepStrictEqual(response, {
        errors: false,
        items: [{
          code: 201,
          externalMessageId: 'id123',
          messageUuid: '063474ec-a34f-4558-90c5-984395000004',
        }],
      });
    });
  });
});
