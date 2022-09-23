const environmentManager = require('../environmentManager');

/**
 * authorization  checks if AUTH_TOKEN matches with the one passed
 * as header
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authorization = (req, res, next) => {
  if (environmentManager.validToken(req.headers.authorization)) {
    next();
  } else {
    console.log('Returning 401 Unauthorized.');
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

module.exports = authorization;