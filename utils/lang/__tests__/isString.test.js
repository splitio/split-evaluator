const { isString } = require('../lang');

test('isString', async (done) => {
  expect(isString(true)).toBe(false);
  expect(isString([])).toBe(false);
  expect(isString(() => true)).toBe(false);
  expect(isString(JSON.parse('{"test": 1}'))).toBe(false);
  expect(isString(12345)).toBe(false);
  expect(isString('test')).toBe(true);
  done();
});