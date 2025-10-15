//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const utils = require('./utils/utils');

// Try to load https-proxy-agent (optional dependency)
let HttpsProxyAgent;
try {
  // For https-proxy-agent v7+, use named export
  const { HttpsProxyAgent: ProxyAgent } = require('https-proxy-agent');
  HttpsProxyAgent = ProxyAgent;
} catch (error) {
  try {
    // Fallback for older versions that use default export
    HttpsProxyAgent = require('https-proxy-agent');
  } catch (fallbackError) {
    // https-proxy-agent is not available, proxy support will be disabled
    HttpsProxyAgent = null;
  }
}

/**
 * Creates a proxy agent based on environment variables
 * Supports standard proxy environment variables: HTTPS_PROXY, HTTP_PROXY, https_proxy, http_proxy
 * @returns {HttpsProxyAgent|null} Proxy agent or null if no proxy configured or https-proxy-agent not available
 */
function createProxyAgent() {
  // Check if https-proxy-agent is available
  if (!HttpsProxyAgent) {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    if (httpsProxy || httpProxy) {
      console.warn('Proxy configuration detected but https-proxy-agent package is not available. Install https-proxy-agent to enable proxy support.');
    }
    return null;
  }
  
  // Check for proxy configuration in standard environment variables
  // Priority: HTTPS_PROXY > https_proxy > HTTP_PROXY > http_proxy
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const proxyUrl = httpsProxy || httpProxy;
  
  if (!proxyUrl) {
    return null;
  }
  
  console.log(`Split.io SDK configured to use proxy: ${proxyUrl}`);
  return new HttpsProxyAgent(proxyUrl);
}

/**
 * Checks if a URL should bypass proxy based on NO_PROXY environment variable
 * @param {string} url - The URL to check
 * @returns {boolean} True if should use proxy, false if should bypass
 */
function shouldUseProxy(url) {
  const noProxy = process.env.NO_PROXY || process.env.no_proxy;
  if (!noProxy) return true;
  
  try {
    const noProxyList = noProxy.split(',').map(item => item.trim());
    const hostname = new URL(url).hostname;
    
    return !noProxyList.some(pattern => {
      if (pattern.startsWith('*')) {
        return hostname.endsWith(pattern.slice(1));
      }
      return hostname === pattern || hostname.includes(pattern);
    });
  } catch (error) {
    // If URL parsing fails, default to using proxy
    console.warn(`Failed to parse URL for proxy bypass check: ${url}`);
    return true;
  }
}

/**
 * Enhances Split.io settings with proxy configuration if available
 * @param {Object} settings - Original Split.io settings
 * @returns {Object} Enhanced settings with proxy configuration
 */
function enhanceSettingsWithProxy(settings) {
  const proxyAgent = createProxyAgent();
  
  if (!proxyAgent) {
    return settings;
  }
  
  return {
    ...settings,
    sync: {
      ...settings.sync,
      requestOptions: {
        ...(settings.sync && settings.sync.requestOptions ? settings.sync.requestOptions : {}),
        agent: proxyAgent
      }
    }
  };
}

const getSplitFactory = (settings) => {
  const logLevel = settings.logLevel;
  delete settings.logLevel;

  // Enhance settings with proxy configuration if available
  const enhancedSettings = enhanceSettingsWithProxy(settings);

  let impressionsMode;
  let telemetry;
  const factory = SplitFactory(enhancedSettings, (modules) => {
    // Do not try this at home.
    modules.settings.sdkVersion = modules.settings.version;
    modules.settings.version = `evaluator-${utils.getVersion()}`;
    impressionsMode = modules.settings.sync.impressionsMode;
    const originalStorageFactory = modules.storageFactory;
    modules.storageFactory = (config) => {
      const storage = originalStorageFactory(config);
      telemetry = storage.telemetry;
      return storage;
    };
  });

  if (logLevel) {
    console.log('Setting log level with', logLevel);
    factory.Logger.setLogLevel(logLevel);
  }

  return { factory, telemetry, impressionsMode };
};

module.exports = {
  getSplitFactory,
};
