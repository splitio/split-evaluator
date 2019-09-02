const request = require('request-promise-native');
const repeat = require('./repeat');
const { getImpressionsToPost } = require('./impressionQueue');

const url = process.env.SPLITIO_IMPRESSION_LISTENER || 'http://localhost:3000/impressions';

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
    .then(response => console.log(response))
    .catch(error => console.log(error)) : Promise.resolve();
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
      20000
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