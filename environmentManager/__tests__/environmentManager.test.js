const request = require('supertest');
const app = require('../../app');

// Mocked client to return authorization key when getTreatment is called
jest.mock('../../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    let sdk = jest.requireActual('../../sdk');
    const factory = sdk.getSplitFactory(settings);
    const client = factory.client();
    client.getTreatment = jest.fn(() => { return factory.settings.core.authorizationKey });
    client.getTreatments = jest.fn(() => { return [factory.settings.core.authorizationKey] });
    client.getTreatmentWithConfig = jest.fn(() => { return { treatment: factory.settings.core.authorizationKey, config: null }});
    client.getTreatmentsWithConfig = jest.fn(() => { return [{ treatment: factory.settings.core.authorizationKey, config: null }] });
    client.track = jest.fn(() => {});
    client.destroy = jest.fn(() => {});
    return factory;
  })
}));

// Multiple environment
// Mocked client should return authorizationKey when getTreatment is called
// to verify that environmentManager is maping the right one for each authToken
describe('environmentManager', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  
  
  
  
  // getTreatment
  describe('get-treatment', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=multiple-environment')
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
      done();
    });
    
    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
      done();
    });
    
    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
      done();
    });

    test('[POST] should be 200 if is valid attributes and return localhost', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
      done();
    });
  
    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment?key=test&split-name=my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
  });
  
  
  
  
  // getTreatments
  describe('get-treatments', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapike', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
      done();
    });
    
    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
      done();
    });
    
    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
    
    
    test('[POST] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
      done();
    });

    test('[POST] should be 200 if is valid attributes and return localhost', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
      done();
    });
  
    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
  });
  
  
  
  
  // getTreatmentWithConfig
  describe('get-treatment-with-config', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=multiple-environment')
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
      done();
    });
    
    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
      done();
    });
    
    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test-multiple');
      expect(response.body.treatment).toEqual('testapikey');
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test');
      expect(response.body.treatment).toEqual('localhost');
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
  });
  
  
  
  
  // getTreatmentsWithConfig
  describe('get-treatments-with-config', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
      done();
    });
    
    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
      done();
    });
    
    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return testapikey', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test-multiple');
      expect(response.body[0].treatment).toEqual('testapikey');
      done();
    });
    
    test('[POST] should be 200 if is valid authToken and return localhost', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'test');
      expect(response.body[0].treatment).toEqual('localhost');
      done();
    });
    
    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async (done) => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=my-experiment')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
      done();
    });
  });
  
})
