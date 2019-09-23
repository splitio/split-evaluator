const okWrapper = require('../wrapper/ok');

test('should parse different values', done => {
  let result = okWrapper('string');
  expect(result).toHaveProperty('valid', true);
  expect(result).toHaveProperty('value', 'string');
  expect(result).not.toHaveProperty('error');

  result = okWrapper(null);
  expect(result).toHaveProperty('valid', true);
  expect(result).toHaveProperty('value', null);
  expect(result).not.toHaveProperty('error');

  result = okWrapper(12345);
  expect(result).toHaveProperty('valid', true);
  expect(result).toHaveProperty('value', 12345);
  expect(result).not.toHaveProperty('error');

  result = okWrapper({ test: '1' });
  expect(result).toHaveProperty('valid', true);
  expect(result).toHaveProperty('value', { test: '1' });
  expect(result).not.toHaveProperty('error');

  done();
});