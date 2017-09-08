'use strict';

const express = require('express');
const path = require('path');
const app = express();
const config = require('config');

const reduce = require('lodash/reduce');
const map = require('lodash/map');

const os = require('os');
const ip = require('ip');

const thenable = require('@splitsoftware/splitio/lib/utils/promise/thenable');

const utils = require('./utils');

const api = require('./sdk');
const client = api.client();
const manager = api.manager();

const port = process.env.SPLITIO_SERVER_PORT || 7548;
const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

if (!EXT_API_KEY) {
  console[console.warn ? 'warn' : 'log']('External API key not provided. If you want a security filter use the EXT_API_KEY environment variable as explained on the README file.');
}

app.use((req, res, next) => {
  if (!EXT_API_KEY || req.headers.authorization == EXT_API_KEY) {
    next();
  } else {
    console.log('Returning 401 Unauthorized.');
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
      curl 'http://localhost:4444/get-treatment?key=my-customer-key&split-name=my-experiment
      &attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization={SPLITIO_EXT_API_KEY}'
  `);

});

app.get('/get-treatment', (req, res) => {
  console.log('Getting a treatment.');  
  const state = req.query;
  const key = utils.parseKey(state.key, state['bucketing-key']);
  const split = state['split-name'];
  let attributes = null;

  try {
    if (state['attributes']) {
      attributes = JSON.parse(state['attributes']);  
    }
  } catch (e) {
    res.status(400).send('There was an error parsing the provided attributes. Check the format.');
    return;
  }

  function asyncResult(treatment) {
    console.log('Returning the treatment.');
    res.set('Cache-Control', config.get('cacheControl'))
      .send({ 
        splitName: split,
        treatment
      });
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
       keys:
         This is the array of keys to be used in the getTreatments call. Each key should specify a "matchingKey" 
         and a "trafficType". You can also specify a "bucketingKey".
       attributes:
         (Optional) This should be a json string of the attributes you want to include in the getTreatments call.

     EXAMPLE
       curl 'http://localhost:4444/get-treatments?keys=\[\{"matchingKey":"my-first-key","trafficType":"account"\},
       \{"matchingKey":"my-second-key","bucketingKey":"my-bucketing-key","trafficType":"user"\}\]
       &attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization={SPLITIO_EXT_API_KEY}'
  `);
});

// Returns the list of split names of a given traffic type
function filterSplitsByTT(splitViews, trafficType) {
  return reduce(splitViews, (acc, view) => {
    if (view.trafficType === trafficType) {
      acc.push(view.name);
    }
    return acc;
  }, []);
}

app.get('/get-treatments', (req, res) => {
  console.log('Getting treatments.');    
  const state = req.query;
  let keys = [];
  try {
    // Keys are required.
    keys = JSON.parse(state.keys);
  } catch (e) {
    res.status(400).send('There was an error parsing the provided keys. Check that the format is correct.');
    return;
  }

  let attributes;

  try {
    if (state['attributes']) {
      attributes = JSON.parse(state['attributes']);
    }
  } catch (e) {
    res.status(400).send('There was an error parsing the provided attributes. Check the format.');
    return;
  }

  const splitsPromise = Promise.resolve(manager.splits()).then(views => {
    return map(keys, key => {
      return {
        trafficType: key.trafficType,
        key: utils.parseKey(key.matchingKey, key.bucketingKey),
        splits: filterSplitsByTT(views, key.trafficType)
      };
    });
  });

  Promise.resolve(splitsPromise)
    // Call getTreatments
    .then(splitsByTT => {
      return reduce(splitsByTT, (acc, group) => {
        // @TODO: Support thenables here when necessary.
        const partial = client.getTreatments(group.key, group.splits, attributes);

        const results = reduce(partial, (acc, treatment, feature) => {
          acc.push({
            splitName: feature,
            treatment
          });
          return acc;
        }, [])

        return acc.concat(results);
      }, []);
    })
    // Send the response to the client
    .then(treatments => {
      console.log('Returning treatments.');
      return res.set('Cache-Control', config.get('cacheControl')).type('json').send(treatments);
    })
    // 500 on error
    .catch(() => res.sendStatus(500));
});

app.get('/version', (req, res) => {
  console.log('Getting version.');
  const version = utils.getVersion();
  const parts = api.settings.version.split('-');
  const sdkLanguage = parts[0];
  const sdkVersion = parts.slice(1).join('-');

  res.send({
    version,
    sdk: sdkLanguage,
    sdkVersion
  });
});

app.get('/machine', (req, res) => {
  console.log('Getting machine information.');
  let address; let hostname;

  try {
    address = ip.address();
    hostname = os.hostname();
  } catch(e) {
    address = hostname = 'unavailable';
  }

  res.send({
    ip: address,
    name: hostname
  });
});

//Route not found -- Set 404
app.get('*', function (req, res) {
  console.log('Wrong endpoint called.');
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