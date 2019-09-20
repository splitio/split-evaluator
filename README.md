# Split Evaluator service

This services exposes a set of APIs to produce server side evaluation of flags by wrapping a NodeJS SDK.

## Usage with NodeJS

1. `nvm use`
2. `npm install`
3. `SPLIT_EVALUATOR_API_KEY=xxxxxxx SPLIT_EVALUATOR_AUTH_TOKEN=yyyyyy SPLIT_EVALUATOR_SERVER_PORT=7548 SPLIT_EVALUATOR_LOG_LEVEL=debug npm start`

   SPLIT_EVALUATOR_API_KEY could be overriden quickly, but we recommend the usage of [node-config](https://github.com/lorenwest/node-config#quick-start),
   switch the environment variable NODE_ENV. Please read the details [here](https://github.com/lorenwest/node-config#quick-start).  
   SPLIT_EVALUATOR_AUTH_TOKEN could be any value you like, against which we will compare the received Authorization header.
   SPLIT_EVALUATOR_SERVER_PORT is the port number on which the server will run, default is 7548.  

## Build Docker Image
This command must be executed at root folder
`docker build -t splitsoftware/split-evaluator:<VERSION> . && docker build -t splitsoftware/split-evaluator:latest .`

## Push Docker Image
Before pushing image you must be logged in docker cloud. So run this command:
`docker login`
And push the image:
`docker push splitsoftware/split-evaluator:<VERSION> && docker push splitsoftware/split-evaluator:latest`

Pushing `latest` image. If tag is not explicit on `docker pull` command, the tag will be set by Docker engine as `latest`. So it is important create an image with this tag and push it.

```shell
docker build -t splitsoftware/split-evaluator:latest .
docker push splitsoftware/split-evaluator:latest
```

## Documentation
For further information about Split Evaluator you can visit our [official SDK documentation](https://help.split.io/hc/en-us/articles/360020037072-Split-Evaluator).

### About Split:
Split is the leading platform for feature experimentation, empowering businesses of all sizes to make smarter product decisions. Companies like Vevo, Twilio, and LendingTree rely on Split to securely release new features, target them to customers, and measure the impact of features on their customer experience metrics. Founded in 2015, Split's team comes from some of the most innovative enterprises in Silicon Valley, including Google, LinkedIn, Salesforce and Databricks. Split is based in Redwood City, California and backed by Accel Partners and Lightspeed Venture Partners.

Our platform is a unified solution for continuous delivery and full-stack experimentation. Split unifies DevOps and product management, helping agile engineering and product teams accelerate the pace of product delivery and make data-driven decisions, through our robust feature flagging and extensive experimentation capabilities. With Split, organizations can now accelerate time to value, mitigate risk, and drive better outcomes, all in a unified platform.

To learn more about Split, contact hello@split.io, or start a 14-day trial at https://www.split.io/signup/.

Split has built and maintains a SDKs for:

* Java [Github](https://github.com/splitio/java-client) [Docs](http://docs.split.io/docs/java-sdk-guide)
* Javascript [Github](https://github.com/splitio/javascript-client) [Docs](http://docs.split.io/docs/javascript-sdk-overview)
* Node [Github](https://github.com/splitio/javascript-client) [Docs](http://docs.split.io/docs/nodejs-sdk-overview)
* .NET [Github](https://github.com/splitio/.net-client) [Docs](http://docs.split.io/docs/net-sdk-overview)
* Ruby [Github](https://github.com/splitio/ruby-client) [Docs](http://docs.split.io/docs/ruby-sdk-overview)
* PHP [Github](https://github.com/splitio/php-client) [Docs](http://docs.split.io/docs/php-sdk-overview)
* Python [Github](https://github.com/splitio/python-client) [Docs](http://docs.split.io/docs/python-sdk-overview)
* GO [Github](https://github.com/splitio/go-client) [Docs](http://docs.split.io/docs/go-sdk-overview)
* Android [Github](https://github.com/splitio/android-client) [Docs](https://docs.split.io/docs/android-sdk-overview)
* IOS [Github](https://github.com/splitio/ios-client) [Docs](https://docs.split.io/docs/ios-sdk-overview)

For a comprehensive list of opensource projects visit our [Github page](https://github.com/splitio?utf8=%E2%9C%93&query=%20only%3Apublic%20).

**Learn more about Split:**

Visit [split.io/product](https://www.split.io/product) for an overview of Split, or visit our documentation at [docs.split.io](http://docs.split.io) for more detailed information.

**System Status:**

We use a status page to monitor the availability of Split’s various services. You can check the current status at [status.split.io](http://status.split.io).
