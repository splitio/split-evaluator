const request = require('supertest');
const app = require('../../app');

// Multiple environment - manager endpoints
describe('environmentManager - manager endpoints', () => {

  // splits
  test('[/splits] should be 200 if is valid authToken and return splits on split2 yaml file for key_red', async () => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits.map(split => {return split.name;}))
      .toEqual(
        ['testing_split_red', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/splits] should be 200 if is valid authToken and return splits on split1 yaml file for key_blue', async () => {
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



  // split
  test('[/split] should be 200 if is valid authToken and return split testing_split_red for key_red', async () => {
    const response = await request(app)
      .get('/manager/split?split-name=testing_split_red')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('testing_split_red');
  });

  test('[/split] should be 200 if is valid authToken and return split testing_split_blue for key_blue', async () => {
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



  // names
  test('[/names] should be 200 if is valid authToken and return splits in split2.yml', async () => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'key_red');
    expect(response.statusCode).toBe(200);
    expect(response.body.splits)
      .toEqual(
        ['testing_split_red', 'testing_split_color', 'testing_split_only_wl', 'testing_split_with_wl', 'testing_split_with_config']
      );
  });

  test('[/names] should be 200 if is valid authToken and return splits in split1.yml', async () => {
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

});