const { validateProperties } = require('../properties');
const { PROPERTIES_WARNING, PROPERTIES_KEY_LIMIT_WARNING } = require('../../constants');

describe('validateProperties', () => {
  let logSpy;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  const invalidObj = (() => {
    const obj = {};
    for (let i = 0; i < 16; i++) obj['k' + i] = i;
    return obj;
  })();

  test('should return error on invalid properties', done => {
    const result = validateProperties('test');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    expect(logSpy).toHaveBeenCalledWith(PROPERTIES_WARNING);
    done();
  });

  test('should return error on invalid properties 2', done => {
    const result = validateProperties('[]');
    expect(result).toHaveProperty('valid', true );
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    expect(logSpy).toHaveBeenCalledWith(PROPERTIES_WARNING);
    done();
  });

  test('should return error on invalid properties 3', done => {
    const result = validateProperties('true');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    expect(logSpy).toHaveBeenCalledWith(PROPERTIES_WARNING);
    done();
  });

  test('should be valid when properties is an object', done => {
    const result = validateProperties('{"my-prop":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-prop': true,
    });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when properties is empty object', done => {
    const result = validateProperties('{}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when properties is null', done => {
    const result = validateProperties();
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should not return error if properties has more than 15 keys (enforced)', done => {
    const result = validateProperties(invalidObj, true);
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    expect(logSpy).toHaveBeenCalledWith(PROPERTIES_KEY_LIMIT_WARNING);
    done();
  });

  test('should be valid if properties has more than 15 keys (not enforced)', done => {
    const result = validateProperties(invalidObj, false);
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', invalidObj);
    expect(result).not.toHaveProperty('error');
    done();
  });
});
