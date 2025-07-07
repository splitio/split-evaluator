const environmentManager = require('../environmentManager').getInstance();

/**
 * split returns splitView for a particular feature flag
 * @param {*} req
 * @param {*} res
 */
const split = async (req, res) => {
  const featureFlagName = req.splitio.featureFlagName;

  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const featureFlag = await manager.split(featureFlagName);
    return featureFlag ? res.send(featureFlag) : res.status(404).send({
      error: `Feature flag "${featureFlagName}" was not found.`,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * splits returns featureFlags
 * @param {*} req
 * @param {*} res
 */
const splits = async (req, res) => {
  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const featureFlags = await manager.splits();
    res.send({
      splits: featureFlags,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * splitNames returns featureFlagNames
 * @param {*} req
 * @param {*} res
 */
const splitNames = async (req, res) => {
  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const featureFlagNames = await manager.names();
    res.send({
      splits: featureFlagNames,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

module.exports = {
  splitNames,
  split,
  splits,
};
