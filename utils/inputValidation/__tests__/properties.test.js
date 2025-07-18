const { validateProperties, validateEvaluationOptions } = require('../properties');

describe('validateProperties', () => {
  test('should return error on invalid properties', done => {
    const expected = 'properties must be a plain object  with only boolean, string, number or null values..';
    const result = validateProperties('test');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid properties 2', done => {
    const expected = 'properties must be a plain object  with only boolean, string, number or null values..';
    const result = validateProperties('[]');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid properties 3', done => {
    const expected = 'properties must be a plain object  with only boolean, string, number or null values..';
    const result = validateProperties('true');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
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
});

describe('validateEvaluationOptions', () => {
  test('should return error on invalid options', done => {
    const expected = 'options must be a plain object.';
    const result = validateEvaluationOptions('test');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid options 2', done => {
    const expected = 'options must be a plain object.';
    const result = validateEvaluationOptions('[]');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid options 3', done => {
    const expected = 'options must be a plain object.';
    const result = validateEvaluationOptions('true');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when options is an object', done => {
    const result = validateEvaluationOptions('{"foo":1}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', { foo: 1 });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when options is empty object', done => {
    const result = validateEvaluationOptions('{}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when options is null', done => {
    const result = validateEvaluationOptions();
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should return error if options.properties is not valid', done => {
    const expected = 'properties must be a plain object  with only boolean, string, number or null values..';
    const result = validateEvaluationOptions('{"properties": "not-an-object"}');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid if options.properties is valid', done => {
    const result = validateEvaluationOptions('{"properties": {"foo": 1, "bar": "baz", "baz": true}}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', { foo: 1, bar: 'baz', baz: true });
    expect(result).not.toHaveProperty('error');
    done();
  });

});
