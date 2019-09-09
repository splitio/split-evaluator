const propertiesValidator = require('../properties');

describe('properties validator', () => {
  test('should return error on invalid properties', async (done) => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('test');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid properties 2', async (done) => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('[]');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid properties 3', async (done) => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('true');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when properties is an object', async (done) => {
    const result = propertiesValidator('{"my-prop":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-prop': true,
    });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when properties is empty object', async (done) => {
    const result = propertiesValidator('{}');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when properties is null', async (done) => {
    const result = propertiesValidator();
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    done();
  });
});
