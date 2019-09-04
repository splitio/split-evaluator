const logger = require('../config/winston');

// Own modules
const sdkModule = require('../sdk');

// Manager we will use
const manager = sdkModule.manager;

/**
 * split returns splitView for a particular split
 * @param {*} req 
 * @param {*} res 
 */
const split = async (req, res) => {
  const splitName = req.splitio.splitName;
  
  try {
    const splits = await manager.split(splitName);
    res.send(splits);
  } catch (error) {
    logger.error(error);
    res.status(500);
  }
};

/**
 * splits returns splits
 * @param {*} req 
 * @param {*} res 
 */
const splits = async (req, res) => {
  try {
    const splits = await manager.splits();
    res.send({
      splits,
    });
  } catch (error) {
    logger.error(error);
    res.status(500);
  }
};

/**
 * splitNames returns splitNames
 * @param {*} req 
 * @param {*} res 
 */
const splitNames = async (req, res) => {
  try {
    const splitNames = await manager.names();
    res.send({
      splits: splitNames,
    });
  } catch (error) {
    logger.error(error);
    res.status(500);
  }
};

module.exports = {
  splitNames,
  split,
  splits,
};
