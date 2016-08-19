# Phone Microservice

Allows to interact with different communication providers through AMQP

## Providers

### [twilio](https://www.twilio.com)

#### Account options
* `authToken`: `twilio` `AUTH_TOKEN`,
* `from`: `twilio` phone number,
* `sid`: `twilio` `SID`,
* `transportOptions`: `twilio` library options
* `type`: 'twilio',

## Usage

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
