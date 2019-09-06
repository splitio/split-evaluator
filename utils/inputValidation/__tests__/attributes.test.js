const attributesValidator = require('../attributes');

describe('attributes validator', () => {
  test('should return error on invalid attributes', async (done) => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('test');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid attributes 2', async (done) => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('[]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid attributes 3', async (done) => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('true');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when attributes is an object', async (done) => {
    const result = attributesValidator('{"my-attr1":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-attr1': true,
    });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when attributes is empty object', async (done) => {
    const result = attributesValidator('{}');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when attributes is null', async (done) => {
    const result = attributesValidator();

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    done();
  });
});
