// Utils
const thenable = require('@splitsoftware/splitio/lib/utils/promise/thenable');
const reduce = require('lodash/reduce');
const map = require('lodash/map');
const config = require('config');

// Own modules
const common = require('./common');
const sdkModule = require('../sdk');

// Client and manager we will use
const client = sdkModule.client;
const manager = sdkModule.manager;

/**
 * getTreatment evaluates a given split-name
 * @param {*} req 
 * @param {*} res 
 */
const getTreatment = (req, res) => {
  const key = common.parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  function asyncResult(treatment) {
    res.set('Cache-Control', config.get('cacheControl'))
      .send({
        evaluation: {
          splitName: split,
          treatment
        }
      });
  }

  const eventuallyAvailableValue = client.getTreatment(key, split, attributes);

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
};

/**
 * getTreatmentWithConfig evaluates a given split-name and returns config also
 * @param {*} req 
 * @param {*} res 
 */
const getTreatmentWithConfig = (req, res) => {
  const key = common.parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  function asyncResult(evaluationResult) {
    res.set('Cache-Control', config.get('cacheControl'))
      .send({
        evaluation: {
          splitName: split,
          treatment: evaluationResult.treatment,
          config: evaluationResult.config
        }
      });
  }

  const eventuallyAvailableValue = client.getTreatmentWithConfig(key, split, attributes);

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
};

/**
 * getTreatments  returns the evaluations for all treatments matching the traffic type of the provided keys.
 * @param {*} req 
 * @param {*} res 
 */
const getTreatments = (req, res) => {
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
        key: common.parseKey(key.matchingKey, key.bucketingKey),
        splits: common.filterSplitsByTT(views, key.trafficType)
      };
    });
  });

  Promise.resolve(splitsPromise)
    // Call getTreatments
    .then(splitsByTT => {
      return reduce(splitsByTT, (acc, group) => {
        // @TODO: Support thenables here when necessary.
        const partial = client.getTreatments(group.key, group.splits, attributes);

        const results = map(partial, (treatment, feature) => {
          return {
            splitName: feature,
            treatment
          };
        });

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
};

module.exports = {
  getTreatment,
  getTreatmentWithConfig,
  getTreatments,
};
