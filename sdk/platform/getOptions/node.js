// @TODO
// 1- handle multiple protocols automatically
// 2- destroy it once the sdk is destroyed
const https = require('https');

const { find } = require('@splitsoftware/splitio-commons/cjs/utils/lang');

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1500,
});

function getOptions(settings) {
  // User provided options take precedence
  if (settings.sync.requestOptions) return settings.sync.requestOptions;

  // If some URL is not HTTPS, we don't use the agent, to let the SDK connect to HTTP endpoints
  if (find(settings.urls, url => !url.startsWith('https:'))) return;

  return {
    agent
  };
}

module.exports = {
  getOptions,
};