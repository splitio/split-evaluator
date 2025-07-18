// Own modules
const { parseKey, filterFeatureFlagsByTT } = require('./common');
const environmentManager = require('../environmentManager').getInstance();

/**
 * getTreatment evaluates a given split-name
 * @param {*} req
 * @param {*} res
 */
const getTreatment = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const featureFlag = req.splitio.featureFlagName;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;

  try {
    const evaluationResult = await client.getTreatment(key, featureFlag, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    res.send({
      splitName: featureFlag,
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
  const featureFlag = req.splitio.featureFlagName;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;


  try {
    const evaluationResult = await client.getTreatmentWithConfig(key, featureFlag, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    res.send({
      splitName: featureFlag,
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
  const featureFlags = req.splitio.featureFlagNames;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;

  try {
    const evaluationResults = await client.getTreatments(key, featureFlags, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    const result = {};
    Object.keys(evaluationResults).forEach(featureFlag => {
      result[featureFlag] = {
        treatment: evaluationResults[featureFlag],
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
  const featureFlags = req.splitio.featureFlagNames;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;

  try {
    const evaluationResults = await client.getTreatmentsWithConfig(key, featureFlags, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    res.send(evaluationResults);
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * getTreatmentsByFlagSets evaluates an array of flag sets and returns configs also
 * @param {*} req
 * @param {*} res
 */
const getTreatmentsByFlagSets = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const flagSets = req.splitio.flagSetNames;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;

  try {
    const evaluationResults = await client.getTreatmentsByFlagSets(key, flagSets, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    const result = {};
    Object.keys(evaluationResults).forEach(featureFlag => {
      result[featureFlag] = {
        treatment: evaluationResults[featureFlag],
      };
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * getTreatmentsWithConfigByFlagSets evaluates an array of flag sets
 * @param {*} req
 * @param {*} res
 */
const getTreatmentsWithConfigByFlagSets = async (req, res) => {
  const client = environmentManager.getClient(req.headers.authorization);
  const key = parseKey(req.splitio.matchingKey, req.splitio.bucketingKey);
  const flagSets = req.splitio.flagSetNames;
  const attributes = req.splitio.attributes;
  const evaluationOptions = req.splitio.options;

  try {
    const evaluationResults = await client.getTreatmentsWithConfigByFlagSets(key, flagSets, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);

    const result = evaluationResults;

    res.send(result);
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
 * allTreatments  matches featureFlags for passed trafficType and evaluates with passed key
 * @param {Object} keys
 * @param {Object} attributes
 * @param {Object} evaluationOptions
 */
const allTreatments = async (authorization, keys, attributes, evaluationOptions) => {
  const manager = environmentManager.getManager(authorization);
  const client = environmentManager.getClient(authorization);
  try {
    // Grabs featureFlags from Manager
    const featureFlagViews = await manager.splits();

    // Makes multiple evaluations for each (trafficType, key)
    const evaluations = {};
    for (let i=0; i< keys.length; i++) {
      const key = keys[i];
      const featureFlagNames = filterFeatureFlagsByTT(featureFlagViews, key.trafficType);
      const evaluation = await client.getTreatmentsWithConfig(
        parseKey(key.matchingKey, key.bucketingKey),
        featureFlagNames,
        attributes,
        evaluationOptions
      );
      // Saves result for each trafficType
      evaluations[key.trafficType] = evaluation;
    }
    environmentManager.updateLastEvaluation(authorization);

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
  const evaluationOptions = req.splitio.options;

  try {
    const treatments = await allTreatments(req.headers.authorization, keys, attributes, evaluationOptions);
    environmentManager.updateLastEvaluation(req.headers.authorization);
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
  const evaluationOptions = req.splitio.options;

  try {
    const treatments = await allTreatments(req.headers.authorization, keys, attributes, evaluationOptions);
    // Erases the config property for treatments
    const trafficTypes = Object.keys(treatments);
    trafficTypes.forEach(trafficType => {
      const featureFlagNames = Object.keys(treatments[trafficType]);
      if (featureFlagNames.length > 0) {
        Object.keys(treatments[trafficType]).forEach(featureFlag => {
          delete treatments[trafficType][featureFlag].config;
        });
      }
    });
    environmentManager.updateLastEvaluation(req.headers.authorization);

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
  getTreatmentsByFlagSets,
  getTreatmentsWithConfigByFlagSets,
  getAllTreatments,
  getAllTreatmentsWithConfig,
  track,
};
