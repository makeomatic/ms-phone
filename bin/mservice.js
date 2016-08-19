#!/usr/bin/env node
const configuration = require('ms-conf');

let dir;
try {
  require('babel-register'); // eslint-disable-line global-require

  dir = '../src';
} catch (e) {
  dir = '../lib';
}

// accepts conf through .env file
// suitable for configuring this in the docker env
const Phone = require(dir);
const phone = new Phone(configuration.get('/'));

phone.connect()
  .then(() => {
    phone.log.info('service started');
  })
  .catch(err => {
    phone.log.fatal('Failed to start service', err);
    setImmediate(() => {
      throw err;
    });
  });
