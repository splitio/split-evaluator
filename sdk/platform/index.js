const EventEmitter = require('events');
const { getFetch } = require('./getFetch');
const { getEventSource } = require('./getEventSource');
const { getOptions } = require('./getOptions');
const { NodeSignalListener } = require('@splitsoftware/splitio-commons/cjs/listeners/node');
const { now } = require('@splitsoftware/splitio-commons/cjs/utils/timeTracker/now/node');

exports.platform = {
  getFetch,
  getEventSource,
  getOptions,
  EventEmitter,
  now,
};

exports.SignalListener = NodeSignalListener;