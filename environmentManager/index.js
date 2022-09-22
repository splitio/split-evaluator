const settings = require('../utils/parserConfigs')();
const { validEnvironment } = require('../utils/parserConfigs/validators');
const { getSplitFactory } = require('../sdk');
const ImpressionManager = require('../listener/manager');

class EnvironmentManager {
  
  constructor() {
    
    // In environments are the apiKey, factory an clientReadiness status related to an authToken
    this._environments = {};
    
    // Ready promises for each client in environment manager
    this._readyPromises = [];
    
    this._initializeEnvironments(JSON.parse(process.env['SPLIT_EVALUATOR_ENVIRONMENTS']));
    
    const impressionManager = new ImpressionManager();
    impressionManager.start();
  }
  
  _initializeEnvironments(environmentConfigs){
    
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
      
      this._clientReadiness(this._environments[authToken].factory.client());
      
    });     
    this.ready();  
  }
  
  _clientReadiness(client){
    this._readyPromises.push(client.ready());
    client.on(client.Event.SDK_READY, () => client.isClientReady = true);
  }
  
  getFactory(authToken) {    
    return this._environments[authToken].factory;
  }
  
  getVersion() {
    return this._environments[this.getAuthTokens()[0]].factory.settings.sdkVersion;
  }
  
  getClient(authToken) {
    return this._environments[authToken].factory.client();
  }
  
  getManager(authToken) {
    return this._environments[authToken].factory.manager();
  }
  
  validToken(authToken) {
    return Object.keys(this._environments).indexOf(authToken) > -1;
  }
  
  getAuthTokens() {
    return Object.keys(this._environments);
  }
  
  ready() {
    return Promise.allSettled(this._readyPromises).then(this._clientsReady = true);
  } 
  
  isReady() {
    return this._clientsReady;
  }
}

module.exports = new EnvironmentManager();