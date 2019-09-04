const logger = require('../config/winston');
const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

/**
 * authorization  checks if EXT_API_KEY matches with the one passed
 * as header
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authorization = (req, res, next) => {
  if (!EXT_API_KEY || req.headers.authorization === EXT_API_KEY) {
    next();
  } else {
    logger.error('Returning 401 Unauthorized.');
    res.status(401).send({
      error: 'Unauthorized'
    });
  }
};

module.exports = authorization;