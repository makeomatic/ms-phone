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
        authToken: '<AUTH_TOKEN>',
        from: '+1 201-559-5555',
        sid: 'ACa35f1e868cead4f1b3a31c6620000000',
        type: 'twilio',
      },
    },
  },
};
