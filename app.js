const express = require('express');
const morgan = require('morgan');
const app = express();
const logger = require('./config/winston');

class LoggerStream {
  write(message) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

// Middlewares
const authorization = require('./middleware/authorization');

const clientRouter = require('./client/client.router');
const managerRouter = require('./manager/manager.router');
const adminRouter = require('./admin/admin.router');

const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

if (!EXT_API_KEY) {
  logger.error('External API key not provided. If you want a security filter use the EXT_API_KEY environment variable as explained on the README file.');
}

// app.use(morgan('tiny'));
app.use(morgan('combined', { stream: new LoggerStream() }));
// Auth middleware
app.use(authorization);
// We mount our routers.
app.use('/', clientRouter);
app.use('/', managerRouter);
app.use('/admin', adminRouter);
app.get('/favicon.ico', (req, res) => res.status(204));

//Route not found -- Set 404
app.get('*', function (req, res) {
  logger.error('Wrong endpoint called.');
  res.json({
    'route': 'Sorry this page does not exist!'
  });
});

module.exports = app;