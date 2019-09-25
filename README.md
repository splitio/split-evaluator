# Split Evaluator [![Build Status](https://api.travis-ci.com/splitio/split-evaluator.svg?branch=master)](https://api.travis-ci.com/splitio/split-evaluator)

## Overview
This services exposes a set of APIs to produce server side evaluation of flags by wrapping a NodeJS SDK.

[![Twitter Follow](https://img.shields.io/twitter/follow/splitsoftware.svg?style=social&label=Follow&maxAge=1529000)](https://twitter.com/intent/follow?screen_name=splitsoftware)
 
## Compatibility
Split Evaluator supports Node version 8 or higher.

## Getting started
Below is a simple example that describes the instantiation of Split Evaluator:

### Usage via NodeJs
1. Install npm packages via `npm install`
2. Then, execute `SPLIT_EVALUATOR_API_KEY=<your-sdk-api-key> SPLIT_EVALUATOR_AUTH_TOKEN=<your-auth-token> SPLIT_EVALUATOR_SERVER_PORT=7548 SPLIT_EVALUATOR_LOG_LEVEL=debug npm start`

### Docker
1. You can pull the Docker image from [Docker Hub](https://hub.docker.com/r/splitsoftware/split-evaluator) and run it into your container environment.

```shell
docker pull splitsoftware/split-evaluator:latest
```

2. Run the image:

```shell
docker run --rm --name split-evaluator \
 -p 7548:7548 \
 -e SPLIT_EVALUATOR_API_KEY=<your-sdk-api-key> \
 -e SPLIT_EVALUATOR_AUTH_TOKEN=<your-auth-token> \
 splitsoftware/split-evaluator
```

Please refer to [our official docs](https://help.split.io/hc/en-us/articles/360020037072-Split-Evaluator) to learn about all the functionality provided by Split Evaluator and the configuration options available for tailoring it to your current application setup.

## Submitting issues 
Split team monitors all issues submitted to this [issue tracker](https://github.com/splitio/split-evaluator/issues). We encourage to use this issue tracker to submit any bug report, feedback and feature enhancements. We'll do our best to respond in a timely manner.

## Contributing
Please see [Contributors Guide](CONTRIBUTORS-GUIDE.md) to find all you need to submit a PR.
 
## License
Licensed under the Apache License, Version 2.0. See: [Apache License](http://www.apache.org/licenses/).

## About Split 
Split is the leading Feature Delivery Platform for engineering teams that want to confidently release features as fast as they can develop them.
Split’s fine-grained management, real-time monitoring, and data-driven experimentation ensure that new features will improve customer experience without breaking or degrading performance.
Companies like Twilio, Salesforce, GoDaddy and WePay trust Split to power their feature delivery.
 
To learn more about Split, contact hello@split.io, or get started with feature flags for free at https://www.split.io/signup.
 
Split has built and maintains a SDKs for:
 
* Java [Github](https://github.com/splitio/java-client) [Docs](http://docs.split.io/docs/java-sdk-guide)
* Javascript [Github](https://github.com/splitio/javascript-client) [Docs](http://docs.split.io/docs/javascript-sdk-overview)
* Node [Github](https://github.com/splitio/javascript-client) [Docs](http://docs.split.io/docs/nodejs-sdk-overview)
* .NET [Github](https://github.com/splitio/.net-core-client) [Docs](http://docs.split.io/docs/net-sdk-overview)
* Ruby [Github](https://github.com/splitio/ruby-client) [Docs](http://docs.split.io/docs/ruby-sdk-overview)
* PHP [Github](https://github.com/splitio/php-client) [Docs](http://docs.split.io/docs/php-sdk-overview)
* Python [Github](https://github.com/splitio/python-client) [Docs](http://docs.split.io/docs/python-sdk-overview)
* GO [Github](https://github.com/splitio/go-client) [Docs](http://docs.split.io/docs/go-sdk-overview)
* Android [Github](https://github.com/splitio/android-client) [Docs](https://docs.split.io/docs/android-sdk-overview)
* IOS [Github](https://github.com/splitio/ios-client) [Docs](https://docs.split.io/docs/ios-sdk-overview)
 
For a comprehensive list of opensource projects visit our [Github page](https://github.com/splitio?utf8=%E2%9C%93&query=%20only%3Apublic%20).
 
**Learn more about Split:** 
Visit [split.io/product](https://www.split.io/product) for an overview of Split, or visit our documentation at [docs.split.io](http://docs.split.io) for more detailed information.