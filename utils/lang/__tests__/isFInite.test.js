const { isFinite } = require('../lang');

test('isFinite', async () => {
  expect(isFinite('test')).toBe(false);
  expect(isFinite(true)).toBe(false);
  expect(isFinite([])).toBe(false);
  expect(isFinite(() => true)).toBe(false);
  expect(isFinite(JSON.parse('{"test": 1}'))).toBe(false);
  expect(isFinite(12345)).toBe(true);
});