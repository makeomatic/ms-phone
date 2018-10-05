module.exports = {
  amqp: {
    transport: {
      connection: {
        host: 'rabbitmq',
      },
    },
  },
  phone: {
    accounts: {
      test_account: {
        authToken: process.env.TEST_AUTH_TOKEN,
        from: process.env.TEST_PHONE_NUMBER,
        sid: process.env.TEST_ACCOUNT_SID,
        type: 'twilio',
      },
    },
  },
};
