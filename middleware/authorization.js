const AUTH_TOKEN = process.env.SPLIT_EVALUATOR_AUTH_TOKEN;

/**
 * authorization  checks if AUTH_TOKEN matches with the one passed
 * as header
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authorization = (req, res, next) => {
  if (!AUTH_TOKEN || req.headers.authorization === AUTH_TOKEN) {
    next();
  } else {
    console.log('Returning 401 Unauthorized.');
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

module.exports = authorization;