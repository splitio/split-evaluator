const errorWrapper = require('../wrapper/error');

test('should parse messages for error', done => {
  const result = errorWrapper('thisIsError');
  expect(result).toHaveProperty('valid', false);
  expect(result).toHaveProperty('error', 'thisIsError');
  expect(result).not.toHaveProperty('value');
  done();
});