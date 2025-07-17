const request = require('supertest');
const app = require('../../app');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url) => {

    const sdkUrl = 'https://sdk.test.io/api/splitChanges?s=1.3&since=-1';
    const splitChange2 = require('../../utils/mocks/splitchanges.since.-1.till.1602796638344.json');
    if (url.startsWith(sdkUrl)) return Promise.resolve({ status: 200, json: () => (splitChange2), ok: true });

    return Promise.resolve({ status: 200, json: () => ({}), ok: true });
  });
});

// Multiple environment - manager endpoints
describe('environmentManager - manager endpoints', () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  // splits
  test('[/splits] should be 200 if is valid authToken and return feature flags on split2 yaml file for key_red', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(split => {return split.name;}))
      .toEqual(
        ['testing_split_red', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/splits] should be 200 if is valid authToken and return feature flags on split1 yaml file for key_blue', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_blue');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(split => {return split.name;}))
      .toEqual(
        ['testing_split_blue', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/splits] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });

  test('[/splits] should be 200 if is valid authToken and return feature flags on set set_green for key_green', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_green');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(flag => {return flag.name;}))
      .toEqual(
        ['test_green', 'test_color', 'test_green_config']
      );
  });

  test('[/splits] should be 200 if is valid authToken and return feature flags on set set_purple for key_purple', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_purple');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(flag => {return flag.name;}))
      .toEqual(
        ['test_color', 'test_purple', 'test_purple_config']
      );
  });

  test('[/splits] should be 200 if is valid authToken and return feature flags on sets set_green & set_purple file for key_pink', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_pink');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(flag => {return flag.name;}))
      .toEqual(
        ['test_green', 'test_color', 'test_green_config', 'test_purple', 'test_purple_config']
      );
  });

  // split
  test('[/split] should be 200 if is valid authToken and return feature flag testing_split_red for key_red', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=testing_split_red')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('testing_split_red');
  });

  test('[/split] should be 200 if is valid authToken and return feature flag testing_split_blue for key_blue', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=testing_split_blue')
      .set('Authorization', 'key_blue');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('testing_split_blue');
  });

  test('[/split] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=testing_split_blue')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });

  test('[/split] should be 200 if is valid authToken and return feature flag test_green for key_green', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=test_green')
      .set('Authorization', 'key_green');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('test_green');
    expect(response.body.sets).toEqual(['set_green']);
  });

  test('[/split] should be 200 if is valid authToken and return feature flag test_purple for key_purple', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=test_purple')
      .set('Authorization', 'key_purple');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('test_purple');
    expect(response.body.sets).toEqual(['set_purple']);
  });

  test('[/split] should be 404 if is valid authToken and return 404 for test_green using key_purple', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=test_green')
      .set('Authorization', 'key_purple');
    expect(response.statusCode).toBe(404);
  });

  test('[/split] should be 200 if is valid authToken and return feature flag test_green for key_pink', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=test_green')
      .set('Authorization', 'key_pink');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('test_green');
    expect(response.body.sets).toEqual(['set_green']);
  });

  test('[/split] should be 200 if is valid authToken and return feature flag test_purple for key_pink', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=test_purple')
      .set('Authorization', 'key_pink');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('test_purple');
    expect(response.body.sets).toEqual(['set_purple']);
  });



  // names
  test('[/names] should be 200 if is valid authToken and return feature flags in split2.yml', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['testing_split_red', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/names] should be 200 if is valid authToken and return feature flags in split1.yml', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_blue');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['testing_split_blue', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/names] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });

  test('[/names] should be 200 if is valid authToken and return feature flags on set set_green for key_green', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_green');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['test_green', 'test_color', 'test_green_config']
      );
  });

  test('[/names] should be 200 if is valid authToken and return feature flags on set set_purple for key_purple', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_purple');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['test_color', 'test_purple', 'test_purple_config']
      );
  });

  test('[/names] should be 200 if is valid authToken and return feature flags on sets set_green & set_purple file for key_pink', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_pink');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['test_green', 'test_color', 'test_green_config', 'test_purple', 'test_purple_config']
      );
  });

});
