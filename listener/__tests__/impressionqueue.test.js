process.env.SPLIT_EVALUATOR_EXT_API_KEY = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const { getSize, addImpression, getImpressionsToPost } = require('../impressionQueue');

const impression1 = {
  keyName: 'keyName',
  feature: 'feature1',
  treatment: 'treatment',
  time: 123456789,
  changeNumber: 123456789,
  label: 'label',
};

const impression2 = {
  keyName: 'keyName',
  feature: 'feature2',
  treatment: 'treatment',
  time: 123456789,
  changeNumber: 123456789,
  label: 'label',
};

describe('impression queue', () => {
  // Test behavior when impressions are added
  test('test add/size', done => {
    expect(getSize()).toEqual(0);
    addImpression(impression1);
    expect(getSize()).toEqual(1);
    done();
  });

  // Test wrapper schema to send impressions, it should be wrapped by feature
  test('test impressionToPost', done => {
    addImpression(impression1);
    addImpression(impression2);
    addImpression(impression1);
    expect(getSize()).toEqual(4);

    const result = getImpressionsToPost();
    expect(getSize()).toEqual(0);
    expect(result.length).toEqual(2);

    expect(result[0]).toHaveProperty('testName', 'feature1');
    expect(result[0]).toHaveProperty('keyImpressions');
    expect(result[0].keyImpressions.length).toEqual(3);
    const cloned1 = Object.assign({}, impression1);
    delete cloned1.feature;
    expect(result[1].keyImpressions).toEqual(expect.arrayContaining([cloned1, cloned1, cloned1]));

    expect(result[1]).toHaveProperty('testName', 'feature2');
    expect(result[1]).toHaveProperty('keyImpressions');
    expect(result[1].keyImpressions.length).toEqual(1);
    const cloned2 = Object.assign({}, impression2);
    delete cloned2.feature;
    expect(result[1].keyImpressions).toEqual(expect.arrayContaining([cloned2]));
    done();
  });
});