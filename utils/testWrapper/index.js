const expectError = (response, code, message) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('error');
  if (message) expect(response.body.error).toBe(message);
};

const expectErrorContaining = (response, code, message) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toEqual(expect.arrayContaining(message));
};

const expectOk = (response, code, treatmentResult, featureFlag, config) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('treatment', treatmentResult);
  expect(response.body).toHaveProperty('splitName', featureFlag);
  // eslint-disable-next-line eqeqeq
  if (config != undefined) {
    expect(response.body).toHaveProperty('config', config);
  }
};

const expectOkMultipleResults = (response, code, expectedTreatment, expectedLength) => {
  expect(response.statusCode).toBe(code);
  // Check length
  const featureFlagNames = Object.keys(response.body);
  expect(featureFlagNames.length).toEqual(expectedLength);
  // Iterate over featureFlags
  const featureFlags = Object.keys(expectedTreatment);
  featureFlags.forEach(featureFlag => {
    if (response.body[featureFlag].treatment) {
      expect(response.body[featureFlag].treatment).toEqual(expectedTreatment[featureFlag].treatment);
    } else {
      expect(response.body[featureFlag]).toEqual(expectedTreatment[featureFlag].treatment);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (expectedTreatment[featureFlag].hasOwnProperty('config')) {
      expect(response.body[featureFlag].config).toEqual(expectedTreatment[featureFlag].config);
    }
  });
};

const expectOkAllTreatments = (response, code, expectedTreatments, expectedLength) => {
  expect(response.statusCode).toBe(code);
  expect(Object.keys(response.body).length).toEqual(expectedLength);
  expect(response.body).toEqual(expectedTreatments);
};

const getLongKey = () => {
  let key = '';
  for (let i = 0; i <=250; i++) {
    key += 'a';
  }
  return key;
};

const gracefulShutDown = async () => {

  const environmentManagerFactory = require('../../environmentManager');
  if (environmentManagerFactory.hasInstance()) {
    await environmentManagerFactory.destroy();
  }

  const impressionManagerFactory = require('../../listener/manager');
  if (impressionManagerFactory.hasInstance()) {
    await impressionManagerFactory.destroy();
  }
};

module.exports = {
  expectError,
  expectErrorContaining,
  expectOk,
  expectOkAllTreatments,
  expectOkMultipleResults,
  getLongKey,
  gracefulShutDown,
};