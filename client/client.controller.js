// Own modules
const { parseKey, filterSplitsByTT } = require('./common');
const sdkModule = require('../sdk');

// Client and manager we will use
const client = sdkModule.client;
const manager = sdkModule.manager;

/**
 * getTreatment evaluates a given split-name
 * @param {*} req 
 * @param {*} res 
 */
const getTreatment = async (req, res) => {
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResult = await client.getTreatment(key, split, attributes);

    res.send({
      evaluation: {
        splitName: split,
        treatment: evaluationResult,
      },
    });
  } catch (error) {
    res.status(500);
  }
};

/**
 * getTreatmentWithConfig evaluates a given split-name and returns config also
 * @param {*} req 
 * @param {*} res 
 */
const getTreatmentWithConfig = async (req, res) => {
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResult = await client.getTreatmentWithConfig(key, split, attributes);

    res.send({
      evaluation: {
        splitName: split,
        treatment: evaluationResult.treatment,
        config: evaluationResult.config,
      },
    });
  } catch (error) {
    res.status(500);
  }
};

/**
 * getTreatments evaluates an array of split-names
 * @param {*} req 
 * @param {*} res 
 */
const getTreatments = async (req, res) => {
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const splits = req.splitio.splitNames;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResults = await client.getTreatments(key, splits, attributes);

    res.send({
      evaluation: evaluationResults,
    });
  } catch (error) {
    res.status(500);
  }
};

/**
 * getTreatmentsWithConfig evaluates an array of split-names and returns configs also
 * @param {*} req 
 * @param {*} res 
 */
const getTreatmentsWithConfig = async (req, res) => {
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const splits = req.splitio.splitNames;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResults = await client.getTreatmentsWithConfig(key, splits, attributes);

    res.send({
      evaluation: evaluationResults,
    });
  } catch (error) {
    res.status(500);
  }
};

/**
 * track events tracking
 * @param {*} req 
 * @param {*} res 
 */
const track = async (req, res) => {
  const key = req.splitio.key;
  const trafficType = req.splitio.trafficType;
  const eventType = req.splitio.eventType;
  const value = req.splitio.value;
  const properties = req.splitio.properties;

  try {
    const track = await client.track(key, trafficType, eventType, value, properties);
    return track ? res.status(200).send('OK') : res.status(400);
  } catch (error) {
    res.status(500);
  }
};

/**
 * allTreatments  matches splits for passed trafficType and evaluates with passed key
 * @param {Object} keys 
 * @param {Object} attributes 
 */
const allTreatments = async (keys, attributes) => {
  try {
    // Grabs Splits from Manager
    const splitViews = await manager.splits();
    // Builds promise array with all the splits for each (tt, key)
    const promises = await Promise.all(keys.map(key => client.getTreatmentsWithConfig(
      parseKey(key.matchingKey, key.bucketingKey),
      filterSplitsByTT(splitViews, key.trafficType),
      attributes)
    ));
    // Creates a view with the result
    const treatments = promises.reduce((acc, evaluation) => {
      const partial = Object.keys(evaluation).map(splitName => ({
        splitName,
        treatment: evaluation[splitName].treatment,
        config: evaluation[splitName].config,
      }));
      return acc.concat(partial);
    }, []);
    return treatments;
  } catch (error) {
    throw Error('Error getting treatments');
  }
};

/**
 * getAllTreatmentsWithConfig  returns the allTreatments evaluations with configs
 * @param {*} req 
 * @param {*} res 
 */
const getAllTreatmentsWithConfig = async (req, res) => {
  const keys = req.splitio.keys;
  const attributes = req.splitio.attributes;

  try {
    const treatments = await allTreatments(keys, attributes);
    res.send(treatments);
  } catch (error) {
    res.status(500);
  }
};

/**
 * getAllTreatments  returns the allTreatments evaluations
 * @param {*} req 
 * @param {*} res 
 */
const getAllTreatments = async (req, res) => {
  const keys = req.splitio.keys;
  const attributes = req.splitio.attributes;

  try {
    const treatments = await allTreatments(keys, attributes);
    res.send(treatments.map(evaluation => ({
      splitName: evaluation.splitName,
      treatment: evaluation.treatment,
    })));
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  getTreatment,
  getTreatments,
  getTreatmentWithConfig,
  getTreatmentsWithConfig,
  getAllTreatments,
  getAllTreatmentsWithConfig,
  track,
};
