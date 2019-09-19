process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const ImpressionQueue = require('../queue');

const impression1 = {
  keyName: 'keyName',
  feature: 'feature1',
  treatment: 'treatment',
  time: 123456789,
  changeNumber: 123456789,
  label: 'label',
};

const impression2 = {
  keyName: 'keyName2',
  feature: 'feature2',
  treatment: 'feature2',
  time: 987654321,
  changeNumber: 987654321,
  label: 'label2',
};

describe('impression queue', () => {
  // Test behavior when impressions are added
  test('test add/size', done => {
    const impressionQueue = new ImpressionQueue();
    expect(impressionQueue.getSize()).toEqual(0);
    impressionQueue.addImpression(impression1);
    expect(impressionQueue.getSize()).toEqual(1);
    done();
  });

  // Test wrapper schema to send impressions, it should be wrapped by feature
  test('test impressionToPost', done => {
    const impressionQueue = new ImpressionQueue();
    impressionQueue.addImpression(impression1);
    impressionQueue.addImpression(impression2);
    impressionQueue.addImpression(impression1);
    expect(impressionQueue.getSize()).toEqual(3);

    const result = impressionQueue.getImpressionsToPost();
    expect(impressionQueue.getSize()).toEqual(0);
    expect(result.length).toEqual(2);

    expect(result[0]).toHaveProperty('testName', 'feature1');
    expect(result[0]).toHaveProperty('keyImpressions');
    expect(result[0].keyImpressions.length).toEqual(2);
    const cloned1 = Object.assign({}, impression1);
    delete cloned1.feature;
    expect(result[0].keyImpressions).toEqual(expect.arrayContaining([cloned1, cloned1]));

    expect(result[1]).toHaveProperty('testName', 'feature2');
    expect(result[1]).toHaveProperty('keyImpressions');
    expect(result[1].keyImpressions.length).toEqual(1);
    const cloned2 = Object.assign({}, impression2);
    delete cloned2.feature;
    expect(result[1].keyImpressions).toEqual(expect.arrayContaining([cloned2]));
    done();
  });
});