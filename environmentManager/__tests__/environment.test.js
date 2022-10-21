/* eslint-disable no-useless-escape */
const request = require('supertest');
const app = require('../../app');

// Multiple environment - client endpoints
describe('environmentManager - client endpoints',  () => {

  // getTreatment
  describe('get-treatment', () => {

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=blue&split-name=testing_split_color')
        .set('Authorization', 'key_blue');
      expect(response.body.treatment).toEqual('blue');
    });

    // Testing crossed environment for authToken key_red
    test('[GET] should be 200 if is valid authToken and return control for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=red&split-name=testing_split_blue')
        .set('Authorization', 'key_red');
      expect(response.body.treatment).toEqual('control');
    });

    // Testing environment for authToken key_red
    test('[GET] should be 200 if is valid authToken and return red for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=red&split-name=testing_split_color')
        .set('Authorization', 'key_red');
      expect(response.body.treatment).toEqual('red');
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatment?key=blue&split-name=testing_split_color')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return whitelisted for key_blue', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=blue&split-name=testing_split_only_wl')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'key_blue');
      expect(response.body.treatment).toEqual('whitelisted');
    });

    test('[POST] should be 200 if is valid attributes and return control', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=red&split-name=testing_split_only_wl')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'key_blue');
      expect(response.body.treatment).toEqual('control');
    });

    test('[POST] should be 200 if is valid attributes and return whitelisted for key_red', async () => {
      const response = await request(app)
        .post('/client/get-treatment?key=red&split-name=testing_split_only_wl')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'key_red');
      expect(response.body.treatment).toEqual('whitelisted');
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
    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=blue&split-names=testing_split_color,not_in_whitelist')
        .set('Authorization', 'key_blue');
      expect(response.body).toEqual(
        {'not_in_whitelist': {'treatment': 'control'}, 'testing_split_color': {'treatment': 'blue'}}
      );
    });

    // Testing crossed environment for authToken key_red
    test('[GET] should be 200 if is valid authToken and return control for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=red&split-names=testing_split_blue,not_in_whitelist')
        .set('Authorization', 'key_red');
      expect(response.body).toEqual(
        {'not_in_whitelist': {'treatment': 'control'}, 'testing_split_blue': {'treatment': 'control'}}
      );
    });

    // Testing environment for authToken key_red
    test('[GET] should be 200 if is valid authToken and return red for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=red&split-names=testing_split_color,not_in_whitelist')
        .set('Authorization', 'key_red');
      expect(response.body).toEqual(
        {'not_in_whitelist': {'treatment': 'control'}, 'testing_split_color': {'treatment': 'red'}}
      );
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatments?key=test&split-names=testing_split_color,not_in_whitelist')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });


    test('[POST] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=blue&split-names=testing_split_color,not_in_whitelist')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'key_blue');
      expect(response.body).toEqual(
        {'not_in_whitelist': {'treatment': 'control'}, 'testing_split_color': {'treatment': 'blue'}}
      );
    });

    test('[POST] should be 200 if is valid attributes and return red for key_red', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=test&split-names=testing_split_color,not_in_whitelist')
        .send({
          attributes: {test:'test'},
        })
        .set('Authorization', 'key_red');
      expect(response.body).toEqual(
        {'not_in_whitelist': {'treatment': 'control'}, 'testing_split_color': {'treatment': 'red'}}
      );
    });

    test('[POST] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatments?key=blue&split-names=testing_split_color,not_in_whitelist')
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
    test('[GET] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=blue&split-name=testing_split_with_config')
        .set('Authorization', 'key_blue');
      expect(response.body.treatment).toEqual('blue');
      expect(JSON.parse(response.body.config)).toEqual({ color: 'blue' });
    });

    // Testing environment for authToken key_red
    test('[GET] should be 200 if is valid authToken and return red for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=red&split-name=testing_split_with_config')
        .set('Authorization', 'key_red');
      expect(response.body.treatment).toEqual('red');
      expect(JSON.parse(response.body.config)).toEqual({ color: 'red' });
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatment-with-config?key=test&split-name=testing_split_with_config')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=blue&split-name=testing_split_with_config')
        .send({attributes: { test:'blue' }})
        .set('Authorization', 'key_blue');
      expect(response.body.treatment).toEqual('blue');
      expect(response.body.config).toEqual('{\"color\": \"blue\"}');
    });

    test('[POST] should be 200 if is valid authToken and return red for key_red', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=red&split-name=testing_split_with_config')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'key_red');
      expect(response.body.treatment).toEqual('red');
      expect(response.body.config).toEqual('{\"color\": \"red\"}');
    });

    test('[POST] should be 200 if is valid authToken and return unauthorized error', async () => {
      const response = await request(app)
        .post('/client/get-treatment-with-config?key=test&split-name=testing_split_with_config')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });
  });




  // getTreatmentsWithConfig
  describe('get-treatments-with-config', () => {
    // Testing environment for authToken test-multiple
    test('[GET] should be 200 if is valid authToken and return red for key_red', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=red&split-names=testing_split_with_config,testing_split_with_wl')
        .set('Authorization', 'key_blue');
      expect(response.body).toEqual({
        'testing_split_with_config': {'config': '{\"color\": \"blue\"}', 'treatment': 'blue'},
        'testing_split_with_wl': {'config': '{\"color\": \"green\"}', 'treatment': 'not_in_whitelist'},
      });
    });

    // Testing environment for authToken test
    test('[GET] should be 200 if is valid authToken and return blue for key_blue', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=testing_split_with_config,testing_split_with_wl')
        .set('Authorization', 'key_red');
      expect(response.body).toEqual({
        'testing_split_with_config': {'config': '{\"color\": \"red\"}', 'treatment': 'red'},
        'testing_split_with_wl': {'config': '{\"color\": \"green\"}', 'treatment': 'not_in_whitelist'},
      });
    });

    // Testing environment for non existent authToken
    test('[GET] should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/get-treatments-with-config?key=test&split-names=testing_split_with_config,testing_split_with_wl')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('[POST] should be 200 if is valid authToken and return configs for key_blue', async () => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=testing_split_with_config,testing_split_with_wl')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'key_blue');
      expect(response.body).toEqual({
        'testing_split_with_config': {'config': '{\"color\": \"blue\"}', 'treatment': 'blue'},
        'testing_split_with_wl': {'config': '{\"color\": \"green\"}', 'treatment': 'not_in_whitelist'},
      });
    });

    test('[POST] should be 200 if is valid authToken and return configs for key_red', async () => {
      const response = await request(app)
        .post('/client/get-treatments-with-config?key=test&split-names=testing_split_with_config,testing_split_with_wl')
        .send({attributes: { test:'test' }})
        .set('Authorization', 'key_red');
      expect(response.body).toEqual({
        'testing_split_with_config': {'config': '{\"color\": \"red\"}', 'treatment': 'red'},
        'testing_split_with_wl': {'config': '{\"color\": \"green\"}', 'treatment': 'not_in_whitelist'},
      });
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
    test('Should be 200 if is valid authToken and track impressions', async () => {
      const response = await request(app)
        .get('/client/track?key=red&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'key_red');
      expect(response.text).toEqual('Successfully queued event');
    });

    // Testing environment for authToken test
    test('Should be 200 if is valid authToken and track impressions', async () => {
      const response = await request(app)
        .get('/client/track?key=blue&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'key_blue');
      expect(response.text).toEqual('Successfully queued event');
    });

    // Testing environment for non existent authToken
    test('Should be 401 if is non existent authToken and return unauthorized error', async () => {
      const response = await request(app)
        .get('/client/track?key=my-key&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}&value=3.0')
        .set('Authorization', 'non-existent');
      expect(response.body).toEqual({'error':'Unauthorized'});
    });

    test('Test destroy', async () => {
      const key = 'key_red';
      let response = await request(app)
        .get('/client/get-treatment?key=blue&split-name=testing_split_color')
        .set('Authorization', key);

      const environmentManager = require('../../environmentManager').getInstance();
      const client = environmentManager.getClient(key);
      const manager = environmentManager.getManager(key);

      expect(response.body.treatment).toEqual('red');
      expect(environmentManager.isReady()).toBe(true);
      expect(client.isClientReady).toBe(true);

      await environmentManager.destroy();
      expect(environmentManager.isReady()).toBe(false);
      response = await request(app)
        .get('/client/get-treatment?key=blue&split-name=testing_split_color')
        .set('Authorization', key);
      expect(response.body).toEqual({'error':'Unauthorized'}); // Environments list should be empty after destroy

      expect(client.track('key', 'tt', 'event')).toBe(false); // After destroy, track calls return false;
      expect(manager.splits().length).toBe(0); // After destroy, manager.splits returns empty array.;

    });
  });

});
