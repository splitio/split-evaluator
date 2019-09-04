const config = require('config');
const logger = require('./config/winston');
const utils = require('./utils/utils');

const app = require('./app');

// Used for BUR
const client = require('./sdk').client;

const PORT = process.env.SPLITIO_SERVER_PORT || 7548;

// Only available for in memory settings.
if (config.get('blockUntilReady')) {
  client.ready().then(spinUpServer);
} else {
  spinUpServer();
}

function spinUpServer() {
  app.listen(PORT, '0.0.0.0', function () {
    utils.uptime('init');
    logger.info(`Server is Up and Running at Port: ${PORT}`);
  });
}
