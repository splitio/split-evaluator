const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const app = express();

// Middlewares
const authorization = require('./middleware/authorization');

// Routes
const clientRouter = require('./client/client.router');
const managerRouter = require('./manager/manager.router');
const adminRouter = require('./admin/admin.router');

// Utils
const utils = require('./utils/utils');

const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

if (!EXT_API_KEY) {
  console[console.warn ? 'warn' : 'log']('External API key not provided. If you want a security filter use the EXT_API_KEY environment variable as explained on the README file.');
}

app.use(morgan('tiny'));

const openApiDefinition = YAML.load(fs.readFileSync('./openapi/openapi.yaml').toString());
openApiDefinition.info.version = utils.getVersion();
openApiDefinition.servers = [{url: `http://localhost:${process.env.SPLITIO_SERVER_PORT || 7548}`}];
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDefinition));

// Auth middleware
app.use(authorization);
// We mount our routers.
app.use('/', clientRouter);
app.use('/', managerRouter);
app.use('/admin', adminRouter);
app.get('/favicon.ico', (req, res) => res.status(204));

//Route not found -- Set 404
app.get('*', function (req, res) {
  console.log('Wrong endpoint called.');
  res.json({
    'route': 'Sorry this page does not exist!',
  });
});

module.exports = app;