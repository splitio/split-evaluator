const request = require('supertest');
const app = require('../../app');
const { gracefulShutDown } = require('../../utils/testWrapper/index');

console.log = jest.fn();

// Mocked client to return authorization key when getTreatment is called
jest.mock('../../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    let sdk = jest.requireActual('../../sdk');
    const factory = sdk.getSplitFactory(settings);
    const client = factory.client();
    client.getTreatment = jest.fn(() => { return factory.settings.core.authorizationKey; });
    client.getTreatments = jest.fn(() => { return [factory.settings.core.authorizationKey]; });
    client.getTreatmentWithConfig = jest.fn(() => { return { treatment: factory.settings.core.authorizationKey, config: null }; });
    client.getTreatmentsWithConfig = jest.fn(() => { return [{ treatment: factory.settings.core.authorizationKey, config: null }]; });
    client.track = jest.fn(() => {
      const authorizationKey = factory.settings.core.authorizationKey;
      console.log(authorizationKey);
      return authorizationKey;
    });
    return factory;
  }),
}));

// Multiple environment - client endpoints
// Mocked client should return authorizationKey when getTreatment is called
// to verify that environmentManager is maping the right one for each authToken
describe('environmentManager - client endpoints', async () => {

  afterEach(async (done) => {
    await gracefulShutDown();
    done();
  });

  // getTreatment
  describe('get-treatment', async() => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=multiple-environment')
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
    });

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
    });

    test('[POST] should be 200 if is valid attributes and return localhost', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
    });

    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });




  // getTreatments
  describe('get-treatments', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapike', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
    });

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });


    test('[POST] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
    });

    test('[POST] should be 200 if is valid attributes and return localhost', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
    });

    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });




  // getTreatmentWithConfig
  describe('get-treatment-with-config', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=multiple-environment')
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
    });

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
    });

    test('[POST] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
    });

    test('[POST] should be 200 if is valid authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });




  // getTreatmentsWithConfig
  describe('get-treatments-with-config', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
    });

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return testapikey', async () => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
    });

    test('[POST] should be 200 if is valid authToken and return localhost', async () => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
    });

    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });




  // track
  describe('track', () => {
    // Testing environment for authToken test-multiple
    test('Should be 200 if is valid authToken and return testapikey', async () => {
      await request(app)
        .get('/client/track?key=my-key&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'test-multiple');
      expect(console.log.mock.calls.pop()[0]).toEqual('testapikey');
    });

    // Testing environment for authToken test
    test('Should be 200 if is valid authToken and return localhost', async () => {
      await request(app)
        .get('/client/track?key=my-key&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'test');
      expect(console.log.mock.calls.pop()[0]).toEqual('localhost');
    });

    // Testing environment for non existent authToken
    test('Should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/track?key=my-key&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });

});
