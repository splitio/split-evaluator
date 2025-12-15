const { SplitFactory } = require('../'); 
const { fetchMock } = require('./utils/fetchMock');

const splitChangesMock1 = require('./mocks/splitchanges.since.-1.json');
const splitChangesMock2 = require('./mocks/splitchanges.since.1457552620999.json');


describe('Evaluator Integration (Online Mode)', () => {
  const apiKey = 'sdk-test-api-key';
  const testUrls = {
    sdk: 'https://sdk.baseurl',
    events: 'https://events.baseurl',
    auth: 'https://auth.baseurl',
    telemetry: 'https://telemetry.baseurl',
  };

  fetchMock.get(testUrls.sdk + '/splitChanges?s=1.3&since=-1&rbSince=-1', { status: 200, body: splitChangesMock1 });
  fetchMock.get(testUrls.sdk + '/splitChanges?s=1.3&since=1457552620999&rbSince=100', { status: 200, body: splitChangesMock2 });
  fetchMock.get(testUrls.auth + '/v2/auth?s=1.3', 200);
  fetchMock.getOnce(testUrls.sdk + '/segmentChanges/employees?since=-1', { status: 200, body: { name: 'employees', added: [], removed: [], since: -1, till: 100 } });
  fetchMock.getOnce(testUrls.sdk + '/segmentChanges/splitters?since=-1', { status: 200, body: { name: 'splitters', added: [], removed: [], since: -1, till: 100 } });
  fetchMock.getOnce(testUrls.sdk + '/segmentChanges/developers?since=-1', { status: 200, body: { name: 'developers', added: [], removed: [], since: -1, till: 100 } });
  fetchMock.get(testUrls.sdk + '/segmentChanges/employees?since=100', { status: 200, body: { name: 'employees', added: [], removed: [], since: 100, till: 100 } });
  fetchMock.get(testUrls.sdk + '/segmentChanges/splitters?since=100', { status: 200, body: { name: 'splitters', added: [], removed: [], since: 100, till: 100 } });
  fetchMock.get(testUrls.sdk + '/segmentChanges/developers?since=100', { status: 200, body: { name: 'developers', added: [], removed: [], since: 100, till: 100 } });
  fetchMock.postOnce(testUrls.events + '/testImpressions/bulk', 200);
  fetchMock.postOnce(testUrls.events + '/testImpressions/count', 200);
  fetchMock.get(testUrls.sdk + '/segmentChanges/segment_excluded_by_rbs?since=-1', { status: 200, body: { added: ['emi@split.io'], removed: [], since: -1, till: 1 } });
  fetchMock.get(testUrls.sdk + '/segmentChanges/segment_excluded_by_rbs?since=1', { status: 200, body: { added: [], removed: [], since: 1, till: 1 } });
  fetchMock.post(testUrls.events + '/testImpressions/bulk', 200);
  fetchMock.post(testUrls.events + '/testImpressions/count', 200);
  fetchMock.post(testUrls.telemetry + '/v1/metrics/config', 200);
  fetchMock.post(testUrls.telemetry + '/v1/metrics/usage', 200);

  afterAll(() => {
    fetchMock.reset();
  });

  test('Full Lifecycle: Init -> Download -> Evaluate -> Destroy', async () => {
    const factory = SplitFactory({
      core: { authorizationKey: apiKey },
      startup: { readyTimeout: 2 },
      urls: testUrls,
    });
    const client = factory.client();

    await new Promise((resolve, reject) => {
      client.on(client.Event.SDK_READY, resolve);
      client.on(client.Event.SDK_READY_TIMED_OUT, () => reject(new Error('Timeout waiting for SDK_READY')));
    });

    const treatment = client.getTreatment('user1', 'always_on');
    expect(treatment).toBe('on');

    await client.destroy();
  });
});