const trafficTypeValidator = require('../trafficType');

describe('trafficType validator', () => {
  test('should return error on undefined', async (done) => {
    const expected = 'you passed a null or undefined traffic-type, traffic-type must be a non-empty string.';

    const result = trafficTypeValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on empty', async (done) => {
    const expected = 'you passed an empty traffic-type, traffic-type must be a non-empty string.';

    const result = trafficTypeValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when ok', async (done) => {
    const result = trafficTypeValidator('my-traffic-type');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-traffic-type');
    expect(result).not.toHaveProperty('error');
    done();
  });
});
