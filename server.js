const config = require('config');
const utils = require('./utils');

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
    console.log('Server is Up and Running at Port : ' + PORT);
  });
}
