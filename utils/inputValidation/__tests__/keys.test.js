const keysValidator = require('../keys');
const { getLongKey } = require('../../testWrapper/index');

describe('keys validator', () => {
  test('should return error on null keys', async () => {
    const expected = 'you passed null or undefined keys, keys must be a non-empty array.';

    const result = keysValidator(null);

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid keys', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('test');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid keys 2', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('{}');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when keys is an empty array', async () => {
    const expected = 'There should be at least one matchingKey-trafficType element.';

    const result = keysValidator('[]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when keys is an invalid array', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('["test":true]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when keys are missing trafficType', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('[{"matchingKey":"my-key"},{"matchingKey":"my-other-key"}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when keys are missing key', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('[{"trafficType":"traffic-key"}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when matchingKey is wrong', async () => {
    const expected = 'keys must be a valid format.';

    const key = getLongKey();
    const result = keysValidator(`[{"matchingKey":${key}, "trafficType":"my-tt", "bucketingKey":"my-bk"}]`);

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when bucketingKey is wrong', async () => {
    const expected = 'keys must be a valid format.';

    const result = keysValidator('[{"matchingKey":"my-key", "trafficType":"my-tt", "bucketingKey":" "}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when keys is ok', async () => {
    const result = keysValidator('[{"matchingKey":"my-key", "trafficType":"my-tt"},{"matchingKey":"my-other-key", "trafficType":"my-tt2"}]');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value');
    console.log(result.value);
    expect(result).not.toHaveProperty('error');
  });
});
