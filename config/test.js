//
// NODEJS SDK - IN MEMORY STORAGE - STANDALONE MODE
//
const path = require('path');

module.exports = {
  sdk: {
    // In case someone uses localhost with the same file
    features: path.join(__dirname, 'split.yml'),
  },
  // Block the ExpressJS server till the SDK is ready.
  blockUntilReady: true,
  // Default cache control header to be used in the answers.
  cacheControl: 'public, max-age=60, s-maxage=60'
};
