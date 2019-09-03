const request = require('request-promise-native');
const repeat = require('./repeat');
const config = require('config');
const IMPRESSION_SEND_RATE = config.get('impressionsSendRate') ? config.get('impressionsSendRate') : 30000;
const { getImpressionsToPost } = require('./impressionQueue');

const url = process.env.SPLITIO_IMPRESSION_LISTENER;

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
    json: true
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

    stop() {
      stopImpressionSenderTimeout && clearTimeout(stopImpressionSenderTimeout);
      stopImpressionSender && stopImpressionSender();
    },
  
    flushAndResetTime() {
      postImpressions(getImpressionsToPost());
      stopImpressionSender.reset();
    },
  };
};

module.exports = ImpressionSender;