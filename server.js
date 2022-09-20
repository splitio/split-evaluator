const config = require('config');
const utils = require('./utils/utils');
const environmentManager = require('./environmentManager');

const app = require('./app');

const PORT = process.env.SPLIT_EVALUATOR_SERVER_PORT || 7548;

// Only available for in memory settings.
if (config.get('blockUntilReady')) {
  environmentManager.ready().then(spinUpServer);
} else {
  spinUpServer();
}

function spinUpServer() {
  app.listen(PORT, '0.0.0.0', function () {
    utils.uptime('init');
    console.log('Server is Up and Running at Port : ' + PORT);
  });
}
