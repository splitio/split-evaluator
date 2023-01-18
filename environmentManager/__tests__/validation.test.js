/* eslint-disable no-useless-escape */
const environmentManagerFactory = require('../index.js');

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

// Multiple environment - client endpoints
describe('environmentManager - input validations',  () => {
  test('SPLIT_EVALUATOR_ENVIRONMENTS ', () => {

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

  });
});