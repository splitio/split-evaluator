/* eslint-disable no-useless-escape */

const validEnvironment = '[{"API_KEY":"localhost","AUTH_TOKEN":"test"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"},{"API_KEY":"apikey2","AUTH_TOKEN":"key_red"}]';
const environmentNotString = [{'API_KEY':'localhost','AUTH_TOKEN':'test'},{'API_KEY':'apikey1','AUTH_TOKEN':'key_blue'},{'API_KEY':'apikey2','AUTH_TOKEN':'key_red'}];
const environmentNotList1 = '{"API_KEY":"localhost","AUTH_TOKEN":"test"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"}';
const environmentNotList2 = '{"API_KEY":"localhost","AUTH_TOKEN":"test"}';
const environmentWithoutAuthToken1 = '[{"API_KEY":"localhost"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"}]';
const environmentWithoutAuthToken2 = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1"}]';
const environmentWithoutApiKey1 = '[{"AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"}]';
const environmentWithoutApiKey2 = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"AUTH_TOKEN":"key_blue"}]';
const environmentWithDuplicatedAuthToken = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_red"}]';
const environmentWithAuthTokenNotString1 = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1","AUTH_TOKEN":123}]';
const environmentWithAuthTokenNotString2 = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1","AUTH_TOKEN":{"key":"value"}}]';
const environmentWithAuthTokenNotString3 = '[{"API_KEY":"localhost","AUTH_TOKEN":"key_red"},{"API_KEY":"apikey1","AUTH_TOKEN":true}]';
const environmentWithAuthTokenEmpty = '[{"API_KEY":"localhost","AUTH_TOKEN":""},{"API_KEY":"apikey1","AUTH_TOKEN":"key_red"}]';
const environmentWithValidFlagSets = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":"set_a,set_b"},{"API_KEY":"key_red","AUTH_TOKEN":"key_red"}]';
const environmentsWithValidFlagSets1 = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":"set_a"},{"API_KEY":"key_red","AUTH_TOKEN":"key_red","FLAG_SET_FILTER":"set_x"}]';
const environmentsWithValidFlagSets2 = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":"set_1"},{"API_KEY":"key_red","AUTH_TOKEN":"key_red","FLAG_SET_FILTER":"set_c"}]';
const environmentWithInvalidFlagSets1 = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":"Set_3,_set_4"},{"API_KEY":"key_red","AUTH_TOKEN":"key_red"}]';
const environmentWithInvalidFlagSets2 = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":["set_y","set_z"]},{"API_KEY":"key_red","AUTH_TOKEN":"key_red"}]';
const environmentWithInvalidFlagSets3 = '[{"API_KEY":"key_green","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":set_t},{"API_KEY":"key_red","AUTH_TOKEN":"key_red"}]';

// Multiple environment - client endpoints
describe('environmentManager - input validations', () => {
  test('SPLIT_EVALUATOR_ENVIRONMENTS ',async () => {
    const environmentManagerFactory = require('../');

    // Testing environment not string
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentNotString;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment not list
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentNotList1;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment not list
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentNotList2;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment Without AuthToken
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentWithoutAuthToken1;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment Without AuthToken
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentWithoutAuthToken2;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment Without ApiKey
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentWithoutApiKey1;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment Without ApiKey
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS=environmentWithoutApiKey2;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With Duplicated AuthToken
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= environmentWithDuplicatedAuthToken;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With AuthToken Not String
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= environmentWithAuthTokenNotString1;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With AuthToken Not String
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= environmentWithAuthTokenNotString2;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With AuthToken Not String
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= environmentWithAuthTokenNotString3;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With AuthToken Empty
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= environmentWithAuthTokenEmpty;
    expect(() => environmentManagerFactory.getInstance()).toThrow();

    // Testing environment With AuthToken Empty
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS= validEnvironment;
    expect(() => environmentManagerFactory.getInstance()).not.toThrow();
    await environmentManagerFactory.destroy();

  });

  test('Flag sets validation', async () => {

    const evaluateFlagSets = async (greenQuery, redQuery) => {
      const environmentManagerFactory = require('../');
      expect(environmentManagerFactory.hasInstance()).toBe(false);
      let environmentManager = environmentManagerFactory.getInstance();

      let environmentSettings = environmentManager.getFactory('key_green').settings;
      let queryString = environmentSettings.sync.__splitFiltersValidation.queryString;
      expect(queryString).toStrictEqual(greenQuery);

      environmentSettings = environmentManager.getFactory('key_red').settings;
      queryString = environmentSettings.sync.__splitFiltersValidation.queryString;
      expect(queryString).toStrictEqual(redQuery);
      await environmentManager.destroy();
      await environmentManagerFactory.destroy();
    };

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentWithValidFlagSets;
    await evaluateFlagSets('&sets=set_a,set_b',null);

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentsWithValidFlagSets1;
    await evaluateFlagSets('&sets=set_a','&sets=set_x');

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentsWithValidFlagSets2;
    await evaluateFlagSets('&sets=set_1','&sets=set_c');

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentWithInvalidFlagSets1;
    await evaluateFlagSets('&sets=set_3',null);

    const environmentManagerFactory = require('../');

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentWithInvalidFlagSets2;
    expect(() => environmentManagerFactory.getInstance()).toThrow();
    expect(environmentManagerFactory.hasInstance()).toBe(false);

    process.env.SPLIT_EVALUATOR_ENVIRONMENTS = environmentWithInvalidFlagSets3;
    expect(() => environmentManagerFactory.getInstance()).toThrow();
    expect(environmentManagerFactory.hasInstance()).toBe(false);

  });
});