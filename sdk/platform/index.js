const EventEmitter = require('events');
const fetch = require('node-fetch');
const { getEventSource } = require('./getEventSource');
const { getOptions } = require('./getOptions');
const { NodeSignalListener } = require('@splitsoftware/splitio-commons/cjs/listeners/node');
const { now } = require('@splitsoftware/splitio-commons/cjs/utils/timeTracker/now/node');

exports.platform = {
  getFetch: () => (fetch),
  getEventSource,
  getOptions,
  EventEmitter,
  now,
};

exports.SignalListener = NodeSignalListener;