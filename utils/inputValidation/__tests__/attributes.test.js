const attributesValidator = require('../attributes');
const validAttributesMock = { 'my-attr1':true, 'my-attr2':5, 'my-attr3': 'asd', 'my-attr4': [] };

describe('attributes validator', () => {
  test('should return error on invalid attributes', done => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('test');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid attributes 2', done => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('[]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on invalid attributes 3', done => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('true');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when attributes is an object', done => {
    const result = attributesValidator(validAttributesMock);
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      ...validAttributesMock,
    });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when attributes is a stringified object', done => {
    const result = attributesValidator(JSON.stringify(validAttributesMock));
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      ...validAttributesMock,
    });
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when attributes is empty object', done => {
    const result = attributesValidator('{}');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when attributes is null', done => {
    const result = attributesValidator();

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
    done();
  });
});
