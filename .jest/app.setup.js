const { gracefulShutDown } = require('../utils/testWrapper/index');

afterAll(async () => {
  await gracefulShutDown();
})
