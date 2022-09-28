const environmentManager = require('../environmentManager');

/**
 * split returns splitView for a particular split
 * @param {*} req
 * @param {*} res
 */
const split = async (req, res) => {
  const splitName = req.splitio.splitName;

  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const split = await manager.split(splitName);
    return split ? res.send(split) : res.status(404).send({
      error: `Split "${splitName}" was not found.`,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * splits returns splits
 * @param {*} req
 * @param {*} res
 */
const splits = async (req, res) => {
  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const splits = await manager.splits();
    res.send({
      splits,
    });
  } catch (error) {
    res.status(500).send({error});
  }
};

/**
 * splitNames returns splitNames
 * @param {*} req
 * @param {*} res
 */
const splitNames = async (req, res) => {
  try {
    const manager = environmentManager.getManager(req.headers.authorization);
    const splitNames = await manager.names();
    res.send({
      splits: splitNames,
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
