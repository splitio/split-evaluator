const settings = require('../utils/parserConfigs')();
const { validEnvironment, validEnvironmentConfig, isString, throwError } = require('../utils/parserConfigs/validators');
const { getSplitFactory } = require('../sdk');
const { obfuscate } = require('../utils/utils');
const SPLIT_EVALUATOR_ENVIRONMENTS = 'SPLIT_EVALUATOR_ENVIRONMENTS';
const SPLIT_EVALUATOR_AUTH_TOKEN = 'SPLIT_EVALUATOR_AUTH_TOKEN';
const SPLIT_EVALUATOR_API_KEY = 'SPLIT_EVALUATOR_API_KEY';

const EnvironmentManagerFactory = (function(){
  /**
   * EnvironmentManager singleton
   */
  class EnvironmentManager {

    constructor() {
      // Contains every environment related to an authToken with its apiKey, factory and clientReadiness status
      this._environments = {};

      // Ready promises for each client in environment manager
      this._readyPromises = [];

      // Used to know if there is any client ready and evaluator should start
      this._clientsReady = false;

      // Defines if openApi security tag should be added
      this.requireAuth = true;

      this._initializeEnvironments();
    }

    _initializeEnvironments(){
      // If environments envVar is not defined, it creates an environment with auth_token and api_key envVars
      if (!process.env.SPLIT_EVALUATOR_ENVIRONMENTS) {
        const AUTH_TOKEN = process.env.SPLIT_EVALUATOR_AUTH_TOKEN;
        // If auth_token envVar is not defined, means that openapi security tag should not be added
        if (!AUTH_TOKEN) {
          this.requireAuth = false;
          process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'splitToken';
        }
        process.env.SPLIT_EVALUATOR_ENVIRONMENTS = `[{
          "AUTH_TOKEN": "${process.env[SPLIT_EVALUATOR_AUTH_TOKEN]}",
          "API_KEY": "${process.env[SPLIT_EVALUATOR_API_KEY]}"
        }]`;
      }

      const environmentConfigs = validEnvironmentConfig(SPLIT_EVALUATOR_ENVIRONMENTS);

      environmentConfigs.forEach(environment => {

        validEnvironment(environment);
        const authToken = environment['AUTH_TOKEN'];
        const apiKey = environment['API_KEY'];
        settings.core.authorizationKey = apiKey;

        if(!isString(authToken)) {
          throwError(`authToken value ${authToken} must be a string value`);
        }

        if (this._environments[authToken]) {
          throwError(`There are two or more environments with the same authToken '${authToken}' `);
        }

        const { factory, telemetry, impressionsMode} = getSplitFactory(settings);

        // Creates an environment for authToken
        this._environments[authToken] = {
          apiKey: apiKey,
          factory: factory,
          isClientReady: false,
          telemetry: telemetry,
          impressionsMode: impressionsMode,
          lastEvaluation: undefined,
        };

        this._clientReadiness(authToken, apiKey);
      });
    }

    _clientReadiness(authToken, apiKey){
      const client = this.getFactory(authToken).client();
      // Add client ready promise to array to wait asynchronously to be resolved
      this._readyPromises.push(client.ready());
      // Encode apiKey to log it without exposing it (like ####1234)
      const encodedApiKey = obfuscate(apiKey);
      // Handle client ready
      client.on(client.Event.SDK_READY, () => {
        console.info(`Client ready for api key ${encodedApiKey}`);
        this._clientsReady = true;
        client.isClientReady = true;
        this._environments[authToken].isClientReady = true;
      });
      // Handle client timed out
      client.on(client.Event.SDK_READY_TIMED_OUT, () => {
        console.info(`Client timed out for api key ${encodedApiKey}`);
        client.isClientReady = false;
        this._environments[authToken].isClientReady = false;
        client.destroy().then(() => {
          console.info('Timed out client destroyed');
        });
      });
    }

    getEnvironment(authToken) {
      return this._environments[authToken];
    }

    getFactory(authToken) {
      if (!this.requireAuth) authToken = 'splitToken';
      return this._environments[authToken].factory;
    }

    getVersion() {
      return this.getFactory(this.getAuthTokens()[0]).settings.sdkVersion;
    }

    getClient(authToken) {
      return this.getFactory(authToken).client();
    }

    getManager(authToken) {
      return this.getFactory(authToken).manager();
    }

    getTelemetry(authToken) {
      if (!this.requireAuth) authToken = 'splitToken';
      const environment = this.getEnvironment(authToken);
      const telemetry = environment.telemetry;
      const stats = {
        splitCount: telemetry ? telemetry.splits.getSplitNames().length : 0,
        segmentCount: telemetry ? telemetry.segments.getRegisteredSegments().length : 0,
        lastSynchronization: telemetry ? telemetry.getLastSynchronization() : {},
        timeUntilReady: telemetry ? telemetry.getTimeUntilReady() : 0,
        httpErrors: telemetry ? telemetry.httpErrors : {},
        ready: environment.isClientReady,
        impressionsMode: environment.impressionsMode,
        lastEvaluation: environment.lastEvaluation,
      };
      return stats;
    }

    updateLastEvaluation(authToken) {
      if (!this.requireAuth) authToken = 'splitToken';
      this._environments[authToken].lastEvaluation = new Date().toJSON();
    }

    validToken(authToken) {
      if (this.requireAuth) return Object.keys(this._environments).indexOf(authToken) > -1;
      return true;
    }

    getAuthTokens() {
      return Object.keys(this._environments);
    }

    // Awaits for every client ready promise
    async ready() {
      return Promise.allSettled(this._readyPromises).then((environmentsStatus) => {
        this._clientsReady = environmentsStatus.some(environment => environment.status === 'fulfilled');
        return this._clientsReady;
      });
    }

    async destroy() {
      return Promise.all(
        this.getAuthTokens().map(authToken => {
          const client = this.getClient(authToken);
          return client.destroy();
        })
      ).then(() => {
        this._clientsReady = false;
        this._environments = [];
      });
    }

    isReady() {
      return this._clientsReady;
    }
  }

  let instance;

  // Singleton handle strategy
  return {
    hasInstance() {
      return !instance ? false : true;
    },
    getInstance() {
      if (!instance) {
        instance = new EnvironmentManager();
      }
      return instance;
    },
    async destroy() {
      if (!instance) return;
      await instance.destroy().then(() => { instance = undefined; });
    },
  };
})();

module.exports = EnvironmentManagerFactory;