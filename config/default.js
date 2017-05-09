//
// NODEJS SDK - IN MEMORY STORAGE - STANDALONE MODE
//
const path = require('path');

module.exports = {
  sdk: {
    core: {
      authorizationKey: 'localhost',
    },
    features: path.join(__dirname, '.split'),
  },
  blockUntilReady: true
};
