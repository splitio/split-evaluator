const os = require('os');
const ip = require('@splitsoftware/splitio/cjs/utils/ip');

const utils = require('../utils/utils');
const environmentManager = require('../environmentManager').getInstance();

/**
 * ping pings server
 * @param {*} req
 * @param {*} res
 */
const ping = (req, res) => {
  console.log('pong');
  res.status(200).send('pong');
};

/**
 * healthcheck  checks if SDK and environtment is healthy or not.
 * 200 - Everything is OK. Ready to evaluate.
 * 500 - Something is wrong or not ready yet. Not able to perform evaluations.
 * @param {*} req
 * @param {*} res
 */
const healthcheck = (req, res) => {
  console.log('Running health check.');
  let status = 500;
  let msg = 'Split evaluator engine is not evaluating traffic properly.';

  if (environmentManager.isReady()) {
    status = 200;
    msg = 'Split Evaluator working as expected.';
  }

  console.log('Health check status: ' + status + ' - ' + msg);
  res.status(status).send(msg);
};

const getVersion = () => {
  const version = utils.getVersion();
  const parts = environmentManager.getVersion().split('-');
  const sdkLanguage = parts[0];
  const sdkVersion = parts.slice(1).join('-');
  return {
    version,
    sdk: sdkLanguage,
    sdkVersion,
  };
};

/**
 * version  returns the current version of Split Evaluator
 * @param {*} req
 * @param {*} res
 */
const version = (req, res) => {
  res.send(getVersion());
};

/**
 * machine  returns the machine instance name and machine ip
 * @param {*} req
 * @param {*} res
 */
const machine = (req, res) => {
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
    name: hostname,
  });
};

/**
 * uptime returns the uptime of the server
 * @param {*} req
 * @param {*} res
 */
const uptime = (req, res) => {
  const uptime = utils.uptime();
  console.log('Getting uptime: ' + uptime);
  res.send('' + uptime);
};

/**
 * stats  Return current status for evaluator and environments.
 *        Evaluator stats in response:
 *          - HealthCheck (Version, sdk and sdkVersion)
 *          - UpTime
 *        Stats for each environment:
 *          - readiness
 *          - splits
 *          - segments
 *          - impressionsMode
 *          - last Evaluation
 *
 * 200 - Everything is OK. Evaluator returns stats.
 * 500 - Something is wrong or not ready yet. Not able to get stats.
 * @param {*} req
 * @param {*} res
 */
const stats = (req, res) => {
  console.log('Running stats.');
  let stats = {
    uptime: utils.uptime(),
    environments: {},
  };

  stats.healthcheck = getVersion();
  if (!environmentManager.isReady()) {
    res.status(500).send('Split evaluator engine is not evaluating traffic properly.');
  }

  const authTokens = environmentManager.getAuthTokens();
  authTokens.forEach((authToken) => {
    stats.environments[utils.obfuscate(authToken)] = environmentManager.getTelemetry(authToken);
  });

  res.status(200).send(stats);
};

module.exports = {
  ping,
  healthcheck,
  version,
  machine,
  uptime,
  stats,
};
