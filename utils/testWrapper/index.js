const expectError = (response, code, message) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toBe(message);
};

const expectErrorContaining = (response, code, message) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toEqual(expect.arrayContaining(message));
};

const expectOk = (response, code, treatmentResult, split, config) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('evaluation');
  expect(response.body.evaluation).toHaveProperty('treatment', treatmentResult);
  expect(response.body.evaluation).toHaveProperty('splitName', split);
  // eslint-disable-next-line eqeqeq
  if (config != undefined) {
    expect(response.body.evaluation).toHaveProperty('config', config);
  }
};

const expectOkMultipleResults = (response, code, expectedTreatment, expectedLength) => {
  expect(response.statusCode).toBe(code);
  expect(response.body).toHaveProperty('evaluation');
  // Check length
  const splitNames = Object.keys(response.body.evaluation);
  expect(splitNames.length).toEqual(expectedLength);
  // Iterate over splits
  const splits = Object.keys(expectedTreatment);
  splits.forEach(split => {
    if (response.body.evaluation[split].treatment) {
      expect(response.body.evaluation[split].treatment).toEqual(expectedTreatment[split].treatment);
    } else {
      expect(response.body.evaluation[split]).toEqual(expectedTreatment[split].treatment);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (expectedTreatment[split].hasOwnProperty('config')) {
      expect(response.body.evaluation[split].config).toEqual(expectedTreatment[split].config);
    }
  });
};

const getLongKey = () => {
  let key = '';
  for (let i = 0; i <=250; i++) {
    key += 'a';
  }
  return key;
};

module.exports = {
  expectError,
  expectErrorContaining,
  expectOk,
  expectOkMultipleResults,
  getLongKey,
};