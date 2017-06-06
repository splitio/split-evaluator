//
// SDK initialization and factory instanciation.
//
'use strict';

const SplitFactory = require('@splitsoftware/splitio');
const config = require('config');
const merge = require('lodash/merge');

// Support for API KEY override
const envSettings = config.get('sdk');
let settings = envSettings;

if (process.env.API_KEY) {
  settings = merge({}, settings, {
    core: {
      authorizationKey: process.env.API_KEY
    }
  });
} else {
  throw new Error('API Key cannot be empty or null.');
}

module.exports = SplitFactory(settings);
