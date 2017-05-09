//
// SDK initialization and factory instanciation.
//
'use strict';

const SplitFactory = require('@splitsoftware/splitio');
const config = require('config');

module.exports = SplitFactory(config.get('sdk'));
