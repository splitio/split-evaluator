# Split Evaluator
[![build workflow](https://github.com/splitio/split-evaluator/actions/workflows/ci.yml/badge.svg)](https://github.com/splitio/split-evaluator/actions)
[![Documentation](https://img.shields.io/badge/split_evaluator-documentation-informational)](https://help.split.io/hc/en-us/articles/360020037072-Split-Evaluator)

## Overview
This services exposes a set of APIs to produce server side evaluation of flags by wrapping a NodeJS SDK.

[![Twitter Follow](https://img.shields.io/twitter/follow/splitsoftware.svg?style=social&label=Follow&maxAge=1529000)](https://twitter.com/intent/follow?screen_name=splitsoftware)

## Compatibility
Split Evaluator supports Node version 16 or higher.

## Getting started
Below is a simple example that describes the instantiation of Split Evaluator:

### Usage via NodeJs
1. Install npm packages via `npm install`
2. Then, execute `SPLIT_EVALUATOR_API_KEY=<YOUR-SDK-KEY> SPLIT_EVALUATOR_AUTH_TOKEN=<YOUR-AUTH-TOKEN> SPLIT_EVALUATOR_SERVER_PORT=7548 SPLIT_EVALUATOR_LOG_LEVEL=debug npm start`

### Docker
1. You can pull the Docker image from [Docker Hub](https://hub.docker.com/r/splitsoftware/split-evaluator) and run it into your container environment.

```shell
docker pull splitsoftware/split-evaluator:latest
```

2. Run the image:

```shell
docker run --rm --name split-evaluator \
 -p 7548:7548 \
 -e SPLIT_EVALUATOR_API_KEY=<YOUR-SDK-KEY> \
 -e SPLIT_EVALUATOR_AUTH_TOKEN=<YOUR-AUTH-TOKEN> \
 splitsoftware/split-evaluator
```

Please refer to [our official docs](https://help.split.io/hc/en-us/articles/360020037072-Split-Evaluator) to learn about all the functionality provided by Split Evaluator and the configuration options available for tailoring it to your current application setup.

## Submitting issues
The Split team monitors all issues submitted to this [issue tracker](https://github.com/splitio/split-evaluator/issues). We encourage you to use this issue tracker to submit any bug reports, feedback, and feature enhancements. We'll do our best to respond in a timely manner.

## Contributing
Please see [Contributors Guide](CONTRIBUTORS-GUIDE.md) to find all you need to submit a Pull Request (PR).

## License
Licensed under the Apache License, Version 2.0. See: [Apache License](http://www.apache.org/licenses/).

## About Split

Split is the leading Feature Delivery Platform for engineering teams that want to confidently deploy features as fast as they can develop them. Split’s fine-grained management, real-time monitoring, and data-driven experimentation ensure that new features will improve the customer experience without breaking or degrading performance. Companies like Twilio, Salesforce, GoDaddy and WePay trust Split to power their feature delivery.

To learn more about Split, contact hello@split.io, or get started with feature flags for free at https://www.split.io/signup.

Split has built and maintains SDKs for:

* .NET [Github](https://github.com/splitio/dotnet-client) [Docs](https://help.split.io/hc/en-us/articles/360020240172--NET-SDK)
* Android [Github](https://github.com/splitio/android-client) [Docs](https://help.split.io/hc/en-us/articles/360020343291-Android-SDK)
* Angular [Github](https://github.com/splitio/angular-sdk-plugin) [Docs](https://help.split.io/hc/en-us/articles/6495326064397-Angular-utilities)
* Flutter [Github](https://github.com/splitio/flutter-sdk-plugin) [Docs](https://help.split.io/hc/en-us/articles/8096158017165-Flutter-plugin)
* GO [Github](https://github.com/splitio/go-client) [Docs](https://help.split.io/hc/en-us/articles/360020093652-Go-SDK)
* iOS [Github](https://github.com/splitio/ios-client) [Docs](https://help.split.io/hc/en-us/articles/360020401491-iOS-SDK)
* Java [Github](https://github.com/splitio/java-client) [Docs](https://help.split.io/hc/en-us/articles/360020405151-Java-SDK)
* JavaScript [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK)
* JavaScript for Browser [Github](https://github.com/splitio/javascript-browser-client) [Docs](https://help.split.io/hc/en-us/articles/360058730852-Browser-SDK)
* Node.js [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020564931-Node-js-SDK)
* PHP [Github](https://github.com/splitio/php-client) [Docs](https://help.split.io/hc/en-us/articles/360020350372-PHP-SDK)
* PHP thin-client [Github](https://github.com/splitio/php-thin-client) [Docs](https://help.split.io/hc/en-us/articles/18305128673933-PHP-Thin-Client-SDK)
* Python [Github](https://github.com/splitio/python-client) [Docs](https://help.split.io/hc/en-us/articles/360020359652-Python-SDK)
* React [Github](https://github.com/splitio/react-client) [Docs](https://help.split.io/hc/en-us/articles/360038825091-React-SDK)
* React Native [Github](https://github.com/splitio/react-native-client) [Docs](https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK)
* Redux [Github](https://github.com/splitio/redux-client) [Docs](https://help.split.io/hc/en-us/articles/360038851551-Redux-SDK)
* Ruby [Github](https://github.com/splitio/ruby-client) [Docs](https://help.split.io/hc/en-us/articles/360020673251-Ruby-SDK)

For a comprehensive list of open source projects visit our [Github page](https://github.com/splitio?utf8=%E2%9C%93&query=%20only%3Apublic%20).

**Learn more about Split:**

Visit [split.io/product](https://www.split.io/product) for an overview of Split, or visit our documentation at [help.split.io](https://help.split.io) for more detailed information.

Trigger CI
