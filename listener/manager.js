const request = require('request-promise-native');
const config = require('config');
const repeat = require('./repeat');
const ImpressionQueue = require('./queue');

const IMPRESSIONS_PER_POST = config.get('impressionsPerPost') ? config.get('impressionsPerPost') : 500;
const IMPRESSION_SEND_RATE = config.get('impressionsSendRate') ? config.get('impressionsSendRate') : 30000;
const URL = process.env.SPLITIO_IMPRESSION_LISTENER;

// ImpressionManager is in charge of creating the ImpressionQueue to store impressions for listener and starts
// the task that will flush impressions every XXX seconds configured in sdk configs. If at some point the queue
// reaches the max size, it will execute an explicit flush of the impressions accumulated.
class ImpressionManager {
  constructor() {
    this._stopImpressionSender = false;
    this._impressionQueue = new ImpressionQueue();
  }

  static postImpressions(impressions) {
    const options = {
      method: 'POST',
      uri: URL,
      body: {
        impressions,
      },
      json: true
    };
    return (impressions.length > 0) ? request(options)
      .then(() => Promise.resolve())
      .catch(error => {
        console.log(error && error.message);
        return Promise.reject(error);
      }) : Promise.resolve();
  }

  _startImpressionsSender() {
    this._stopImpressionSender = repeat(
      schedulePublisher => ImpressionManager.postImpressions(this._impressionQueue.getImpressionsToPost()).then(() => schedulePublisher()),
      IMPRESSION_SEND_RATE
    );
  }

  // This will be used every time that the max amount of impressions is reached
  _flushAndResetTime() {
    ImpressionManager.postImpressions(this._impressionQueue.getImpressionsToPost());
    this._stopImpressionSender.reset();
  }

  start() {
    this._startImpressionsSender();
  }

  trackImpression(impression) {
    this._impressionQueue.addImpression(impression);

    // Flushes only if is greater than equal IMPRESSIONS_PER_POST
    if (this._impressionQueue.getSize() >= IMPRESSIONS_PER_POST) {
      this._flushAndResetTime();
    }
  }
}

module.exports = ImpressionManager;