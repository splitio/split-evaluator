# Split Evaluator service

This services exposes a set of APIs to produce server side evaluation of flags by wrapping a NodeJS SDK.

## Usage with NodeJS

1. `nvm use`
2. `npm install`
3. `SPLITIO_API_KEY=xxxxxxx SPLITIO_EXT_API_KEY=yyyyyy SPLITIO_SERVER_PORT=7548 SPLITIO_DEBUG='on' npm start`

   SPLITIO_API_KEY could be overriden quickly, but we recommend the usage of [node-config](https://github.com/lorenwest/node-config#quick-start),
   switch the environment variable NODE_ENV. Please read the details [here](https://github.com/lorenwest/node-config#quick-start).  
   SPLITIO_EXT_API_KEY could be any value you like, against which we will compare the received Authorization header.
   SPLITIO_SERVER_PORT is the port number on which the server will run, default is 7548.  
   For logging details see the [NodeJS SDK docs](https://docs.split.io/docs/nodejs-sdk-overview#section-logging).  

## Services

    GET
      /get-treatment

    QUERY PARAMS
      key:
        This is the key used in the getTreatment call.
      bucketing-key:
        (Optional) This is the bucketing key used in the getTreatment call.
      split-name:
        This should be the name of the split you want to include in the getTreatment call.
      attributes:
        (Optional) This should be a json string of the attributes you want to include in the getTreatment call.

    EXAMPLE
      curl 'http://localhost:4444/get-treatment?key=my-customer-key&split-name=my-experiment&attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization: {SPLITIO_EXT_API_KEY}'

    RESPONSE
      {
        "splitName": "my-experiment",
        "treatment": "on"
      }

    GET
      /get-treatments

    QUERY PARAMS
      keys:
        This is the array of keys to be used in the getTreatments call. Each key should specify a `matchingKey` 
        and a `trafficType`. You can also specify a `bucketingKey`.
      attributes:
        (Optional) This should be a json string of the attributes you want to include in the getTreatments call.

    EXAMPLE
      curl 'http://localhost:4444/get-treatments?keys=\[\{"matchingKey":"my-first-key","trafficType":"account"\},\{"matchingKey":"my-second-key","bucketingKey":"my-bucketing-key","trafficType":"user"\}\]&attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization: {SPLITIO_EXT_API_KEY}'

    RESPONSE
      [
        { "splitName": "my-experiment", "treatment":"on" },
        { "splitName": "my-second-experiment", "treatment":"off" },
        ...
        { "splitName": "my-last-experiment", "treatment":"visa" }
      ]

    GET 
      /admin/version

    EXAMPLE 
      curl 'http//localhost:4444/admin/version' -H 'Authorization: {SPLITIO_EXT_API_KEY}'
      
    RESPONSE
      {
        version: '1.0.2',
        sdk: 'nodejs',
        sdkVersion: '9.3.4'
      }

    GET 
      /admin/machine

    EXAMPLE 
      curl 'http//localhost:4444/admin/machine' -H 'Authorization: {SPLITIO_EXT_API_KEY}'
      
    RESPONSE
      {
        ip: '10.0.0.125',
        name: 'machine_name'
      }
    
    GET 
      /admin/ping

    EXAMPLE 
      curl 'http//localhost:4444/admin/ping' -H 'Authorization: {SPLITIO_EXT_API_KEY}'
      
    RESPONSE
      200: 'pong'
    
    GET 
      /admin/healthcheck

    EXAMPLE 
      curl 'http//localhost:4444/admin/healthcheck' -H 'Authorization: {SPLITIO_EXT_API_KEY}'
      
    RESPONSE
      200: 'Split Evaluator working as expected'

    GET 
      /admin/uptime

    EXAMPLE 
      curl 'http//localhost:4444/admin/uptime' -H 'Authorization: {SPLITIO_EXT_API_KEY}'
      
    RESPONSE
      200: '0d 23h 5m 10s'


## Running the service in Docker container

### Command to build & run the docker container :
By default te server uses the port 7548, which is the one exposed by the container.
You can use a different one by setting the `SPLITIO_SERVER_PORT` environment variable,
but their exposure of that port to the host will depend on your settings.
_You can just leave the default port and map it to whatever port you need_

*Pull the image:* `docker pull splitsoftware/split-evaluator:<VERSION>`  

*Run the container:*  

```shell
docker run -e SPLITIO_API_KEY={YOUR_API_KEY} -e SPLITIO_DEBUG='off' -e SPLITIO_SERVER_PORT=7549 -p 4444:7549 splitsoftware/split-evaluator:<VERSION>
```

**NOTE:** *SPLITIO_DEBUG & SPLITIO_SERVER_PORT are optionals*

#### Configs:
`SPLITIO_EXT_API_KEY` : Callhome will validate every request against Authorization header. This is not a Split API key but an arbitrary value.  
`SPLITIO_API_KEY` : Api-Key for you Split Environment.  
`SPLITIO_DEBUG` : (Optional) Usable for enabling/disabling the logs of the SDK. By default they are off.  
`SPLITIO_SERVER_PORT` :  TCP Port of the server inside the container.

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
