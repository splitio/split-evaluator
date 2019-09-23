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
  expect(response.body).toHaveProperty('treatment', treatmentResult);
  expect(response.body).toHaveProperty('splitName', split);
  // eslint-disable-next-line eqeqeq
  if (config != undefined) {
    expect(response.body).toHaveProperty('config', config);
  }
};

const expectOkMultipleResults = (response, code, expectedTreatment, expectedLength) => {
  expect(response.statusCode).toBe(code);
  // Check length
  const splitNames = Object.keys(response.body);
  expect(splitNames.length).toEqual(expectedLength);
  // Iterate over splits
  const splits = Object.keys(expectedTreatment);
  splits.forEach(split => {
    if (response.body[split].treatment) {
      expect(response.body[split].treatment).toEqual(expectedTreatment[split].treatment);
    } else {
      expect(response.body[split]).toEqual(expectedTreatment[split].treatment);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (expectedTreatment[split].hasOwnProperty('config')) {
      expect(response.body[split].config).toEqual(expectedTreatment[split].config);
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

module.exports = {
  expectError,
  expectErrorContaining,
  expectOk,
  expectOkAllTreatments,
  expectOkMultipleResults,
  getLongKey,
};