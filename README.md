# Phone Microservice

[![npm version](https://badge.fury.io/js/ms-phone.svg)](https://badge.fury.io/js/ms-phone)
[![Build Status](https://semaphoreci.com/api/v1/makeomatic/ms-phone/branches/master/shields_badge.svg)](https://semaphoreci.com/makeomatic/ms-phone)
[![codecov](https://codecov.io/gh/makeomatic/ms-phone/branch/master/graph/badge.svg)](https://codecov.io/gh/makeomatic/ms-phone)

Allows to interact with different communication providers through AMQP.

## Providers

### [twilio](https://www.twilio.com)

#### Account options
* `authToken`: `twilio` `AUTH_TOKEN`,
* `from`: `twilio` phone number,
* `sid`: `twilio` `SID`,
* `transportOptions`: `twilio` library options
* `type`: 'twilio',

## Usage

API [documentation](https://makeomatic.github.io/ms-phone/).

```js
const AMQP = require('ms-amqp-transport');
const Phone = require('ms-mailer');

const phone = new Phone({
  amqp: {
    // ms-amqp-transport options
  },
  accounts: {
    twilio_test: {
      // twilio account options
    }
  }
});

const phoneService = phone.connect();

// e.g.
const amqp = AMQP.connect();
const message = {
  account: 'twilio_test',
  message: 'Hello!'
  to: '+7 923 555 55 55'
};

amqp.publishAndWait('phone.message.predefined', message)
  .then(response => {
    // provider response
  });
```
