const config = require('config');
const utils = require('./utils/utils');
const environmentManagerFactory = require('./environmentManager');
const environmentManager = environmentManagerFactory.getInstance();
const impressionManagerFactory = require('./listener/manager');

const app = require('./app');

const PORT = process.env.SPLIT_EVALUATOR_SERVER_PORT || 7548;

let server;
// Only available for in memory settings.
if (config.get('blockUntilReady')) {
  environmentManager.ready().then(ready => spinUpServer(ready));
} else {
  environmentManager.ready().then(ready => {
    if (!ready) {
      console.log('There is no client ready, initialization aborted');
      process.exit(0);
    }
  });
  spinUpServer(true);
}

function spinUpServer(splitClientsReady) {
  if (!splitClientsReady) {
    console.log('There is no client ready, initialization aborted');
    return;
  }
  server = app.listen(PORT, '0.0.0.0', function () {
    utils.uptime('init');
    console.log('Server is Up and Running at Port : ' + PORT);
  });
}

gracefulShutDown('SIGTERM');
gracefulShutDown('SIGINT');

function gracefulShutDown(signal) {
  process.on(signal, async () => {
    console.info(`${signal} signal received.`);
    await environmentManagerFactory.destroy();
    await impressionManagerFactory.destroy();
    server.close(() => {
      console.log('Http server closed.');
      process.exit(0);
    });
  });
}
