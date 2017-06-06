'use strict';

const express = require('express');
const path = require('path');
const app = express();
const config = require('config');

const thenable = require('@splitsoftware/splitio/lib/utils/promise/thenable');

const utils = require('./utils');

const api = require('./sdk');
const client = api.client();
const manager = api.manager();

const port = process.env.PORT || 80;
const EXT_API_KEY = process.env.EXT_API_KEY;

if (!EXT_API_KEY) {
  throw new Error('External API Key cannot be empty or null.');
}

app.use((req, res, next) => {
  if (req.headers.Authorization == EXT_API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');    
  }
});

app.get('/describe/get-treatment', (req, res) => {

  res.type('text').send(`
    GET
      /get-treatment

    QUERY PARAMS
      key:
        This is the key used in the getTreatment call.
      bucketing-key:
        (Optional) This is the bucketing key used in the getTreatment call.
      split-name:
        This should be the name of the split you want to include in the getTreatment call.
      attributes:
        (Optional) This should be a json string of the attributes you want to include in the getTreatment call.

    EXAMPLE
      curl 'http://localhost:4444/get-treatment?key=my-customer-key&split=my-experiment'
  `);

});

app.get('/get-treatment', (req, res) => {
  const state = req.query;
  const key = utils.parseKey(state.key, state['bucketing-key']);
  const split = state['split-name'];
  let attributes = null;

  try {
    attributes = JSON.parse(state['attributes']);
  } catch (e) {}

  function asyncResult(treatment) {
    res.set('Cache-Control', config.get('cacheControl')).send({ treatment });
  }

  const eventuallyAvailableValue = client.getTreatment(key, split, attributes);

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
});

app.get('/describe/get-treatments', (req, res) => {

  res.type('text').send(`
    GET
      /get-treatments

    QUERY PARAMS
      key:
        This is the key used in the getTreatments call.
      bucketing-key:
        (Optional) This is the bucketing key used in the getTreatments call.
      split-names:
        List of comman-separated splits you want to include in the getTreatments call.
      attributes:
        (Optional) This should be a json string of the attributes you want to include in the getTreatments call.

    EXAMPLE
      curl 'http://localhost:4444/get-treatments?key=my-customer-key&split-names=my-experiment,another-experiment'
  `);

});

app.get('/get-treatments', (req, res) => {
  const state = req.query;
  const key = utils.parseKey(state.key, state['bucketing-key']);

  let splits;
  let attributes;

  if (state['split-names'] && state['split-names'].length > 0) {
    splits = state['split-names'].split(',');
  } else {
    splits = Promise.resolve(manager.splits()).then(views => views.map(v => v.name));
  }

  try {
    attributes = JSON.parse(state['attributes']);
  } catch (e) {}

  Promise.resolve(splits)
    // Call getTreatments
    .then(names => client.getTreatments(key, names, attributes))
    // Send the response to the client
    .then(treatments => res.set('Cache-Control', config.get('cacheControl')).type('json').send(treatments))
    // 500 on error
    .catch(() => res.sendStatus(500));
});

app.get('/version', (req, res) => {
  const parts = api.settings.version.split('-');
  const language = parts[0];
  const version = parts.slice(1).join('-');
  const ip = api.settings.runtime.ip;
  const hostname = api.settings.runtime.hostname;
  const nodejsVersion = process.version;

  res.send({
    language,
    version,
    ip,
    hostname,
    nodejsVersion
  });
});

//Route not found -- Set 404
app.get('*', function (req, res) {
  res.json({
    'route': 'Sorry this page does not exist!'
  });
});

function spinUpServer() {
  app.listen(port, '0.0.0.0', function () {
    console.log('Server is Up and Running at Port : ' + port);
  });
}

// Only available for in memory settings.
if (config.get('blockUntilReady')) {
  client.ready().then(spinUpServer);
} else {
  spinUpServer();
}
