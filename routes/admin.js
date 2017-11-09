/**
 * To be mounted at /admin
 */
const express = require('express');
const router = express.Router();

const os = require('os');
const ip = require('ip');

const utils = require('../utils');
const sdkModule = require('../sdk');
const sdk = sdkModule.factory;

/**
 * ping method, just that.
 */
router.get('/ping', (req, res) => {
  console.log('pong');
  res.status(200).send('pong');
});
/**
 * health check method. Will respond according to SDK status. Two options:
 *    200 - Everything is OK. Ready to evaluate.
 *    500 - Something is wrong or not ready yet. Not able to perform evaluations.
 */
router.get('/healthcheck', (req, res) => {
  console.log('Running health check.');
  let status = 500;
  let msg = 'Split evaluator engine is not evaluating traffic properly.';

  if (sdkModule.isReady()) {
    status = 200;
    msg = 'Split Evaluator working as expected.';
  }

  console.log('Health check status: ' + status + ' - ' + msg);
  res.status(status).send(msg);
});
/**
 * version method. Returns the version of the Split evaluator and the SDK type and version.
 */
router.get('/version', (req, res) => {
  console.log('Getting version.');
  const version = utils.getVersion();
  const parts = sdk.settings.version.split('-');
  const sdkLanguage = parts[0];
  const sdkVersion = parts.slice(1).join('-');

  res.send({
    version,
    sdk: sdkLanguage,
    sdkVersion
  });
});
/**
 * Returns some data from the machine running the evaluator, ip and hostname.
 */
router.get('/machine', (req, res) => {
  console.log('Getting machine information.');
  let address; let hostname;

  try {
    address = ip.address();
    hostname = os.hostname();
  } catch(e) {
    address = hostname = 'unavailable';
  }

  res.send({
    ip: address,
    name: hostname
  });
});
/**
 * Returns the uptime of the server.
 */
router.get('/uptime', (req, res) => {
  const uptime = utils.uptime();
  console.log('Getting uptime: ' + uptime);
  res.send('' + uptime);
});

module.exports = router;
