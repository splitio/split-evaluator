const { nullOrEmpty, parseNumber, validUrl } = require('../validators');

describe('validators', () => {
  test('nullOrEmpty', done => {
    expect(() => nullOrEmpty().toThrow());
    expect(() => nullOrEmpty('').toThrow());
    expect(() => nullOrEmpty('   ').toThrow());
    expect(() => nullOrEmpty('a').not.toThrow());
    done();
  });

  test('parseNumber', done => {
    expect(() => parseNumber().toThrow());
    expect(() => parseNumber('').toThrow());
    expect(() => parseNumber('   ').toThrow());
    expect(() => parseNumber('a').toThrow());
    expect(() => parseNumber('123').not.toThrow());
    done();
  });

  test('validUrl', done => {
    expect(() => validUrl().toThrow());
    expect(() => validUrl('').toThrow());
    expect(() => validUrl('   ').toThrow());
    expect(() => validUrl('a').toThrow());
    expect(() => validUrl('123').not.toThrow());
    expect(() => validUrl('http://123.123.123:1234').not.toThrow());
    expect(() => validUrl('http://localhost').not.toThrow());
    expect(() => validUrl('http://localhost/imp').not.toThrow());
    expect(() => validUrl('https://123.123.123:1234').not.toThrow());
    expect(() => validUrl('https://123.123.123:1234/imp').not.toThrow());
    expect(() => validUrl('www.test.com').not.toThrow());
    expect(() => validUrl('www.test.com:12345').not.toThrow());
    expect(() => validUrl('www.test.com:12345/impr').not.toThrow());
    expect(() => validUrl('www.test.com/impr').not.toThrow());
    done();
  });
});
