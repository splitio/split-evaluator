const EXT_API_KEY = process.env.SPLITIO_EXT_API_KEY;

const authorization = (req, res, next) => {
  if (!EXT_API_KEY || req.headers.authorization === EXT_API_KEY) {
    next();
  } else {
    console.log('Returning 401 Unauthorized.');
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  authorization,
};