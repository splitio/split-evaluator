const lang = require('../lang');

describe('lang', () => {
  test('isObject', async () => {
    expect(lang.isObject('test')).toBe(false);
    expect(lang.isObject(true)).toBe(false);
    expect(lang.isObject([])).toBe(false);
    expect(lang.isObject(12345)).toBe(false);
    expect(lang.isObject(() => true)).toBe(false);
    expect(lang.isObject(JSON.parse('{"test": 1}'))).toBe(true);
    expect(lang.isObject({})).toBe(true);
  });
});