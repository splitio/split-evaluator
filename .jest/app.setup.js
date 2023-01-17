const { gracefulShutDown } = require('../utils/testWrapper/index');

afterAll( async (done) => {
  await gracefulShutDown();
  done()
})