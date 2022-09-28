const request = require('supertest');
const app = require('../../app');

// Mocked client to return authorization key when getTreatment is called
jest.mock('../../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    let sdk = jest.requireActual('../../sdk');
    const factory = sdk.getSplitFactory(settings);
    const manager = factory.manager();
    manager.split = jest.fn(() => { return factory.settings.core.authorizationKey; });
    manager.splits = jest.fn(() => { return factory.settings.core.authorizationKey; });
    manager.names = jest.fn(() => { return factory.settings.core.authorizationKey; });
    return factory;
  }),
}));

// Multiple environment - manager endpoints
// Mocked manager should return authorizationKey when getTreatment is called
// to verify that environmentManager is maping the right one for each authToken
describe('environmentManager - manager endpoints', () => {

  // splits
  test('[/splits] should be 200 if is valid authToken and return testapikey', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'test-multiple');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits).toEqual('testapikey');
  });

  test('[/splits] should be 200 if is valid authToken and return localhost', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits).toEqual('localhost');
  });

  test('[/splits] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });



  // split
  test('[/split] should be 200 if is valid authToken and return testapikey', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=multiple-environment')
      .set('Authorization', 'test-multiple');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('testapikey');
  });

  test('[/split] should be 200 if is valid authToken and return localhost', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=multiple-environment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('localhost');
  });

  test('[/split] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=multiple-environment')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });



  // names
  test('[/names] should be 200 if is valid authToken and return testapikey', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'test-multiple');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits).toEqual('testapikey');
  });

  test('[/names] should be 200 if is valid authToken and return localhost', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits).toEqual('localhost');
  });

  test('[/names] should be 401 if is non existent authToken and return unauthorized error', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'non-existent');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({'error':'Unauthorized'});
  });

});