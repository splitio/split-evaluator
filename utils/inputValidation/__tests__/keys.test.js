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
    const expected = 'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.';

    const result = keysValidator('[{"matchingKey":"my-key"},{"matchingKey":"my-other-key"}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when keys are missing matchingKey', async () => {
    const expected = 'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.';

    const result = keysValidator('[{"trafficType":"traffic-key"}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when matchingKey is wrong', async () => {
    const expected = 'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.';

    const key = getLongKey();
    const result = keysValidator(`[{"matchingKey":"${key}","trafficType":"my-tt","bucketingKey":"my-bk"}]`);

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when matchingKey is not string', async () => {
    const expected = 'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.';

    const result = keysValidator('[{"matchingKey": [], "trafficType":"my-tt", "bucketingKey":"my-bk"}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when bucketingKey is wrong', async () => {
    const expected = 'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.';

    const result = keysValidator('[{"matchingKey":"my-key", "trafficType":"my-tt", "bucketingKey":" "}]');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when keys is ok', async () => {
    const result = keysValidator('[{"matchingKey":"my-key", "trafficType":"my-tt"},{"matchingKey":"my-other-key", "trafficType":"my-tt2"}]');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value');
    expect(result.value[0].matchingKey).toEqual('my-key');
    expect(result.value[0].trafficType).toEqual('my-tt');
    expect(result.value[1].matchingKey).toEqual('my-other-key');
    expect(result.value[1].trafficType).toEqual('my-tt2');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when matchingKey is number', async () => {
    const result = keysValidator('[{"matchingKey":12345, "trafficType":"my-tt"},{"matchingKey":"my-other-key", "trafficType":"my-tt2"}]');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value');
    expect(result.value[0].matchingKey).toEqual('12345');
    expect(result.value[0].trafficType).toEqual('my-tt');
    expect(result.value[1].matchingKey).toEqual('my-other-key');
    expect(result.value[1].trafficType).toEqual('my-tt2');
    expect(result).not.toHaveProperty('error');
  });
});
