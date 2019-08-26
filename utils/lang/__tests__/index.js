const { isObject, uniq } = require('../lang');

describe('lang', () => {
  test('isObject', async () => {
    expect(isObject('test')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(12345)).toBe(false);
    expect(isObject(() => true)).toBe(false);
    expect(isObject(JSON.parse('{"test": 1}'))).toBe(true);
    expect(isObject({})).toBe(true);
  });

  test('uniq', async () => {
    expect(uniq([])).toEqual([]);
    expect(uniq(['test'])).toEqual(['test']);
    expect(uniq(['test', 'test'])).toEqual(['test']);
    expect(uniq(['test', 'test2', 'test'])).toEqual(['test', 'test2']);
  });
});