const fetch = require('node-fetch');
const config = require('config');
const repeat = require('./repeat');
const ImpressionQueue = require('./queue');

const IMPRESSIONS_PER_POST = config.get('impressionsPerPost') ? config.get('impressionsPerPost') : 500;
const IMPRESSION_SEND_RATE = config.get('impressionsSendRate') ? config.get('impressionsSendRate') : 30000;

// ImpressionManager is in charge of creating the ImpressionQueue to store impressions for listener and starts
// the task that will flush impressions every XXX seconds configured in sdk configs. If at some point the queue
// reaches the max size, it will execute an explicit flush of the impressions accumulated.
const ImpressionManagerFactory = (function(){
  class ImpressionManager {
    constructor() {
      this._stopImpressionSender = false;
      this._impressionQueue = new ImpressionQueue();
      this._startImpressionsSender();
    }

    static postImpressions(impressions) {
      const url = process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT;
      const options = {
        method: 'POST',
        body: JSON.stringify({ impressions }),
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };
      return (impressions.length > 0) ? fetch(url, options)
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

    trackImpression(impression) {
      this._impressionQueue.addImpression(impression);

      // Flushes only if is greater than equal IMPRESSIONS_PER_POST
      if (this._impressionQueue.getSize() >= IMPRESSIONS_PER_POST) {
        this._flushAndResetTime();
      }
    }

    destroy(){
      this._stopImpressionSender();
    }
  }

  let instance;

  return {
    hasInstance() {
      return !instance ? false : true;
    },
    getInstance() {
      if (!instance) {
        instance = new ImpressionManager();
      }
      return instance;
    },
    async destroy() {
      if (!instance) return;
      await instance.destroy();
      instance = undefined;
    },
  };
})();

module.exports = ImpressionManagerFactory;