const express = require('express');
const morgan = require('morgan');
const app = express();

// Middlewares
const authorization = require('./middleware/authorization').authorization;

const clientRouter = require('./client/client.router');
const adminRouter = require('./admin/admin.router');

const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

if (!EXT_API_KEY) {
  console[console.warn ? 'warn' : 'log']('External API key not provided. If you want a security filter use the EXT_API_KEY environment variable as explained on the README file.');
}

app.use(morgan('tiny'));
// Auth middleware
app.use(authorization);
// We mount our routers.
app.use('/', clientRouter);
app.use('/admin', adminRouter);
app.get('/favicon.ico', (req, res) => res.status(204));

//Route not found -- Set 404
app.get('*', function (req, res) {
  console.log('Wrong endpoint called.');
  res.json({
    'route': 'Sorry this page does not exist!'
  });
});

module.exports = app;