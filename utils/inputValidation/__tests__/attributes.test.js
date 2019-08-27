const attributesValidator = require('../attributes');

describe('attributes validator', () => {
  test('should return error on invalid attributes', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('test');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 2', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('[]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 3', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('true');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when attributes is an object', async () => {
    const result = attributesValidator('{"my-attr1":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-attr1': true,
    });
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is empty object', async () => {
    const result = attributesValidator('{}');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is null', async () => {
    const result = attributesValidator();

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });
});
