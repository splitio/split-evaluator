const request = require('request-promise-native');
const config = require('config');
const repeat = require('./repeat');
const { getImpressionsToPost } = require('./impressionQueue');

const IMPRESSION_SEND_RATE = config.get('impressionsSendRate') ? config.get('impressionsSendRate') : 30000;
const url = process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT;

/**
 * postImpressions  posts impressions to provided endpoint
 * @param {array} impressions 
 */
const postImpressions = (impressions) => {
  const options = {
    method: 'POST',
    uri: url,
    body: {
      impressions,
    },
    json: true,
  };
  return impressions.length > 0 ? request(options)
    .then(() => Promise.resolve())
    .catch(error => console.log(error && error.message)) : Promise.resolve();
};

/**
 * ImpressionSender  task sender for impressions
 */
const ImpressionSender = () => {
  let stopImpressionSenderTimeout = false;
  let stopImpressionSender = false;

  // Starts task to send impressions
  const startImpressionsSender = () => {
    stopImpressionSender = repeat(
      schedulePublisher => postImpressions(getImpressionsToPost()).then(() => schedulePublisher()),
      IMPRESSION_SEND_RATE
    );
  };

  return {
    start() {
      startImpressionsSender();
    },

    // In case we need to stop the process
    stop() {
      stopImpressionSenderTimeout && clearTimeout(stopImpressionSenderTimeout);
      stopImpressionSender && stopImpressionSender();
    },
  
    // This will be used every time that the max amount of impressions is reached
    flushAndResetTime() {
      postImpressions(getImpressionsToPost());
      stopImpressionSender.reset();
    },
  };
};

module.exports = ImpressionSender;