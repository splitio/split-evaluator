const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const app = express();
const { validUrl } = require('./utils/parserConfigs/validators');
const environmentManager = require('./environmentManager').getInstance();

// Middlewares
const authorization = require('./middleware/authorization');

// Routes
const clientRouter = require('./client/client.router');
const managerRouter = require('./manager/manager.router');
const adminRouter = require('./admin/admin.router');

// Utils
const utils = require('./utils/utils');

app.use(morgan('tiny'));

// OPENAPI 3.0 Definition
// Grabs yaml
const openApiDefinition = YAML.load(fs.readFileSync('./openapi/openapi.yaml').toString());
// Informs warn and remove security tag
if (!environmentManager.requireAuth) {
  delete openApiDefinition.security;
  delete openApiDefinition.components.securitySchemes;
  console[console.warn ? 'warn' : 'log']('External API key not provided. If you want a security filter use the SPLIT_EVALUATOR_AUTH_TOKEN environment variable as explained in our documentation.');
}
// Updates version to current one
openApiDefinition.info.version = utils.getVersion();
// Puts server url and port

// SWAGGER URL
const swaggerUrl = process.env.SPLIT_EVALUATOR_SWAGGER_URL ? validUrl('SPLIT_EVALUATOR_SWAGGER_URL') : `http://localhost:${process.env.SPLIT_EVALUATOR_SERVER_PORT || 7548}`;
openApiDefinition.servers = [{url: swaggerUrl}];

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiDefinition));

// Auth middleware
app.use(authorization);
// We mount our routers.
app.use('/client', clientRouter);
app.use('/manager', managerRouter);
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