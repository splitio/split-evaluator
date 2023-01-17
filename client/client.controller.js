// Own modules
const { parseKey, filterSplitsByTT } = require('./common');
const environmentManager = require('../environmentManager').getInstance();

/**
 * getTreatment evaluates a given split-name
 * @param {*} req
 * @param {*} res
 */
const getTreatment = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResult = await client.getTreatment(key, split, attributes);

    res.send({
      splitName: split,
      treatment: evaluationResult,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * getTreatmentWithConfig evaluates a given split-name and returns config also
 * @param {*} req
 * @param {*} res
 */
const getTreatmentWithConfig = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const split = req.splitio.splitName;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResult = await client.getTreatmentWithConfig(key, split, attributes);

    res.send({
      splitName: split,
      treatment: evaluationResult.treatment,
      config: evaluationResult.config,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * getTreatments evaluates an array of split-names
 * @param {*} req
 * @param {*} res
 */
const getTreatments = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const splits = req.splitio.splitNames;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResults = await client.getTreatments(key, splits, attributes);

    const result = {};
    Object.keys(evaluationResults).forEach(split => {
      result[split] = {
        treatment: evaluationResults[split],
      };
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * getTreatmentsWithConfig evaluates an array of split-names and returns configs also
 * @param {*} req
 * @param {*} res
 */
const getTreatmentsWithConfig = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const splits = req.splitio.splitNames;
  const attributes = req.splitio.attributes;

  try {
    const evaluationResults = await client.getTreatmentsWithConfig(key, splits, attributes);

    res.send(evaluationResults);
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * track events tracking
 * @param {*} req
 * @param {*} res
 */
const track = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = req.splitio.key;
  const trafficType = req.splitio.trafficType;
  const eventType = req.splitio.eventType;
  const value = req.splitio.value;
  const properties = req.splitio.properties;

  try {
    const tracked = await client.track(key, trafficType, eventType, value, properties);
    return tracked ? res.status(200).send('Successfully queued event') : res.status(400);
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * allTreatments  matches splits for passed trafficType and evaluates with passed key
 * @param {Object} keys
 * @param {Object} attributes
 */
const allTreatments = async (authorization, keys, attributes) => {
  const manager = environmentManager.getManager(authorization);
  const client = environmentManager.getClient(authorization);
  try {
    // Grabs Splits from Manager
    const splitViews = await manager.splits();

    // Makes multiple evaluations for each (trafficType, key)
    const evaluations = {};
    for (let i=0; i< keys.length; i++) {
      const key = keys[i];
      const splitNames = filterSplitsByTT(splitViews, key.trafficType);
      const evaluation = await client.getTreatmentsWithConfig(
        parseKey(key.matchingKey, key.bucketingKey),
        splitNames,
        attributes);
      // Saves result for each trafficType
      evaluations[key.trafficType] = evaluation;
    }

    return evaluations;
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
    const treatments = await allTreatments(req.headers.authorization, keys, attributes);
    res.send(treatments);
  } catch (error) {
    res.status(500).send({error});
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
    const treatments = await allTreatments(req.headers.authorization, keys, attributes);
    // Erases the config property for treatments
    const trafficTypes = Object.keys(treatments);
    trafficTypes.forEach(trafficType => {
      const splitNames = Object.keys(treatments[trafficType]);
      if (splitNames.length > 0) {
        Object.keys(treatments[trafficType]).forEach(split => {
          delete treatments[trafficType][split].config;
        });
      }
    });

    res.send(treatments);
  } catch (error) {
    res.status(500).send({error});
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
