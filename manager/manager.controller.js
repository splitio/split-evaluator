// Utils
const thenable = require('@splitsoftware/splitio/lib/utils/promise/thenable');

// Own modules
const sdkModule = require('../sdk');

// Manager we will use
const manager = sdkModule.manager;

/**
 * split returns splitView for a particular split
 * @param {*} req 
 * @param {*} res 
 */
const split = (req, res) => {
  const splitName = req.splitio.splitName;

  function asyncResult(split) {
    res.send(split);
  }

  const eventuallyAvailableValue = manager.split(splitName);

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
};

/**
 * splits returns splits
 * @param {*} req 
 * @param {*} res 
 */
const splits = (req, res) => {
  function asyncResult(splits) {
    res.send({
      splits
    });
  }

  const eventuallyAvailableValue = manager.splits();

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
};

/**
 * splitNames returns splitNames
 * @param {*} req 
 * @param {*} res 
 */
const splitNames = (req, res) => {
  function asyncResult(splitNames) {
    res.send({
      splits: splitNames
    });
  }

  const eventuallyAvailableValue = manager.names();

  if (thenable(eventuallyAvailableValue)) eventuallyAvailableValue.then(asyncResult);
  else asyncResult(eventuallyAvailableValue);
};

module.exports = {
  splitNames,
  split,
  splits,
};
