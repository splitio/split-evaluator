'use strict';

const express = require('express');
const app = express();
const config = require('config');
const utils = require('./utils');
// Used for BUR
const client = require('./sdk').client;

const evaluatorRouter = require('./routes/evaluator');
const adminRouter = require('./routes/admin');

const PORT = process.env.SPLITIO_SERVER_PORT || 7548;
const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

if (!EXT_API_KEY) {
  console[console.warn ? 'warn' : 'log']('External API key not provided. If you want a security filter use the EXT_API_KEY environment variable as explained on the README file.');
}
// Auth middleware
app.use((req, res, next) => {
  if (!EXT_API_KEY || req.headers.authorization === EXT_API_KEY) {
    next();
  } else {
    console.log('Returning 401 Unauthorized.');
    res.status(401).send('Unauthorized');
  }
});
// We mount our routers.
app.use('/', evaluatorRouter);
app.use('/admin', adminRouter);

//Route not found -- Set 404
app.get('*', function (req, res) {
  console.log('Wrong endpoint called.');
  res.json({
    'route': 'Sorry this page does not exist!'
  });
});

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
