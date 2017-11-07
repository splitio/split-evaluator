/**
 * To be mounted at / (root).
 */
const express = require('express');
const router = express.Router();
// Utils
const thenable = require('@splitsoftware/splitio/lib/utils/promise/thenable');
const reduce = require('lodash/reduce');
const map = require('lodash/map');
const config = require('config');
// Own modules
const utils = require('../utils');
const sdkModule = require('../sdk');
// Client and manager we will use
const client = sdkModule.client;
const manager = sdkModule.manager;

/**
 * get-treatment endpoint. Evaluates a given split.
 */
router.get('/get-treatment', (req, res) => {
  console.log('Getting a treatment.');  
  const state = req.query;
  const key = utils.parseKey(state.key, state['bucketing-key']);
  const split = state['split-name'];
  let attributes = null;

  try {
    if (state['attributes']) {
      attributes = JSON.parse(state['attributes']);  
    }
  } catch (e) {
    res.status(400).send('There was an error parsing the provided attributes. Check the format.');
    return;
  }

  function asyncResult(treatment) {
    console.log('Returning the treatment.');
    res.set('Cache-Control', config.get('cacheControl'))
      .send({ 
        splitName: split,
        treatment
      });
  }

  const eventuallyAvailableValue = client.getTreatment(key, split, attributes);

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
});
/**
 * get-treatments endpoint. 
 * Returns the evaluations for all treatments matching the traffic type of the provided keys.
 */
router.get('/get-treatments', (req, res) => {
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
        key: utils.parseKey(key.matchingKey, key.bucketingKey),
        splits: filterSplitsByTT(views, key.trafficType)
      };
    });
  });

  Promise.resolve(splitsPromise)
    // Call getTreatments
    .then(splitsByTT => {
      return reduce(splitsByTT, (acc, group) => {
        // @TODO: Support thenables here when necessary.
        const partial = client.getTreatments(group.key, group.splits, attributes);

        const results = reduce(partial, (acc, treatment, feature) => {
          acc.push({
            splitName: feature,
            treatment
          });
          return acc;
        }, [])

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
});

/**
 * Utility function. Reduces a collection of split views to a list of names of the splits
 * corresponding to the given traffic type.
 */
function filterSplitsByTT(splitViews, trafficType) {
  return reduce(splitViews, (acc, view) => {
    if (view.trafficType === trafficType) {
      acc.push(view.name);
    }
    return acc;
  }, []);
}

module.exports = router;

