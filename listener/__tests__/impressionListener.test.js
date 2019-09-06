process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';
process.env.SPLITIO_IMPRESSION_LISTENER = 'http://localhost:7546';

const http = require('http');
const request = require('supertest');
const app = require('../../app');
const { expectOk, expectOkMultipleResults } = require('../../utils/testWrapper/index');

/**
 * matcherIlRequest matches the request body with paramaters passed
 * @param {string} body 
 * @param {number} length 
 * @param {array} expectedSplits 
 */
const matcherIlRequest = (body, length, expectedSplits) => {
  const ilRequest = JSON.parse(body);
  expect(ilRequest).toHaveProperty('impressions');
  const impressions = ilRequest.impressions;
  expect(impressions.length).toEqual(length);
  const parsed = {};
  impressions.forEach(impression => {
    parsed[impression.testName] = impression.keyImpressions;
  });
  expectedSplits.forEach(expected => {
    expect(parsed).toHaveProperty(expected.split);
    expect(parsed[expected.split].length).toEqual(expected.length);
  });
};

describe('impression-listener', () => {
  let server;
  let body = '';

  beforeAll(done => {
    // Create a server simulating a place to POST impressions when an IL is attached
    server = http.createServer((req, res) => {
      if (req.method === 'POST') {
        req.on('data', data => {
          body += data;
        });
        req.on('end', () => {
          res.write('ok');
          res.end();
          return;
        });
      } else {
        res.write('ok');
        res.end();
      }
    });
    server.listen(7546, done);
  });

  afterAll(done => {
    server.close(done);
  });

  test('should have 5 impressions sent by max impressions to post', async (done) => {
    // Generate the max size of impressions to be sent
    let response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
    response = await request(app)
      .get('/get-treatments?key=test&split-names=my-experiment,other-experiment-3,other-experiment-2,other-experiment')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': { treatment: 'on' },
      'other-experiment-3': { treatment: 'off' },
      'other-experiment-2': { treatment: 'on' },
      'other-experiment': { treatment: 'control' },
    }, 4);
    await new Promise(done => setTimeout(done, 400));
    // Matches all the impressions in hte body of the IL Post Impressions
    matcherIlRequest(body, 4, [
      { split: 'my-experiment', length: 2 },
      { split: 'other-experiment-3', length: 1 },
      { split: 'other-experiment', length: 1 },
      { split: 'other-experiment-2', length: 1 },
    ]);
    body = '';
    done();
  });

  test('should have 1 impressions sent by time schedule', async (done) => {
    // Generate one impression and just wait until is sent by scheduler (1 second for testing)
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');

    await new Promise(done => setTimeout(done, 400));
    // Matches the impression in hte body of the IL Post Impressions
    matcherIlRequest(body, 1, [{ split: 'my-experiment', length: 1 }]);
    body = '';
    done();
  });
});  