const settings = require('../utils/parserConfigs')();
const { validEnvironment, validEnvironmentConfig } = require('../utils/parserConfigs/validators');
const { getSplitFactory } = require('../sdk');
const SPLIT_EVALUATOR_ENVIRONMENTS = 'SPLIT_EVALUATOR_ENVIRONMENTS';
const SPLIT_EVALUATOR_AUTH_TOKEN = 'SPLIT_EVALUATOR_AUTH_TOKEN';
const SPLIT_EVALUATOR_API_KEY = 'SPLIT_EVALUATOR_API_KEY';

const EnvironmentManagerFactory = (function(){
  class EnvironmentManager {

    constructor() {

      // In environments are the apiKey, factory an clientReadiness status related to an authToken
      this._environments = {};

      // Ready promises for each client in environment manager
      this._readyPromises = [];

      this.requireAuth = true;

      this._initializeEnvironments();
    }

    _initializeEnvironments(){
      if (!process.env.SPLIT_EVALUATOR_ENVIRONMENTS) {
        const AUTH_TOKEN = process.env.SPLIT_EVALUATOR_AUTH_TOKEN;
        if (!AUTH_TOKEN) this.requireAuth = false;
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

        this._environments[authToken] = {
          apiKey: apiKey,
          factory: getSplitFactory(settings),
          isClientReady: false,
        };

        const client = this.getFactory(authToken).client();
        this._clientReadiness(client, apiKey);


      });
      this.ready();
    }

    _clientReadiness(client, apiKey){
      this._readyPromises.push(client.ready());
      const encodedApiKey = apiKey.replace(/.(?=.{4,}$)/g, '#');
      client.on(client.Event.SDK_READY, () => {
        console.info(`Client ready for api key ${encodedApiKey}`)
        client.isClientReady = true
      });
      client.on(client.Event.SDK_READY_TIMED_OUT, () => {
        console.error(`Client timed out for api key ${encodedApiKey}`);
        process.exit();
      });
    }

    getFactory(authToken) {
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

    validToken(authToken) {
      if (this.requireAuth) return Object.keys(this._environments).indexOf(authToken) > -1;
      return true;
    }

    getAuthTokens() {
      return Object.keys(this._environments);
    }

    async ready() {
      return Promise.allSettled(this._readyPromises).then(() => {
        this._clientsReady = true;
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
      await instance.destroy().then(() => { instance = undefined; });
    },
  };
})();

module.exports = EnvironmentManagerFactory;