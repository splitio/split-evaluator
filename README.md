# CALLHOME NODEJS

## Usage

1. `nvm use`
2. `npm install`
3. `API_KEY=xxxxxxx SPLITIO_DEBUG='on' npm start`

   API_KEY could be overriden quickly, but we recommend the usage of [node-config](https://github.com/lorenwest/node-config#quick-start),
   switch the environment variable NODE_ENV. Please read the details [here](https://github.com/lorenwest/node-config#quick-start).
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
      curl 'http://localhost:4444/get-treatment?key=my-customer-key&split-name=my-experiment'



     GET
       /get-treatments

     QUERY PARAMS
       key:
         This is the key used in the getTreatments call.
       bucketing-key:
         (Optional) This is the bucketing key used in the getTreatments call.
       split-names:
         List of comman-separated splits you want to include in the getTreatments call.
       attributes:
         (Optional) This should be a json string of the attributes you want to include in the getTreatments call.

     EXAMPLE
       curl 'http://localhost:4444/get-treatments?key=my-customer-key&split-names=my-experiment,another-experiment'

4. Running the service in Docker container

    Pre-requisite :
    - docker engine
    - docker-compose

    Command to build & run the docker container :
    - `SPLITIO_EXT_API_KEY=yyyyyyy SPLITIO_API_KEY=xxxxxxx SPLITIO_PORT=90 -E docker-compose up`

      SPLITIO_EXT_API_KEY : Callhome will validate every request against Authorization header. This is not a Split API key but an arbitrary value <br>
      SPLITIO_API_KEY : Api-Key for you Split Environment <br>
      SPLITIO_DEBUG : (Optional) Usable for enabling/disabling the logs of the SDK. By default they are off. <br>      
      SPLITIO_SERVER_PORT : TCP Port of the server inside the container.

    The container will serve the above endpoints.
    - /get-treatment
    - /get-treatments

## Running the service in Docker container

### Command to build & run the docker container :
*Pull the image:* `docker pull splitsoftware/callhome:1.1`
*Run the container:*
```shell
docker run -e EXT_API_KEY=${SPLITIO_EXT_API_KEY} \
-e API_KEY=${SPLITIO_API_KEY} \
-e SPLITIO_DEBUG='off' \ 
-p ${SPLITIO_SERVER_PORT}:7548 \
splitsoftware/callhome:1.1
```
**NOTE:** *SPLITIO_DEBUG is optional*

#### Configs:
`SPLITIO_EXT_API_KEY` : Callhome will validate every request against Authorization header. This is not a Split API key but an arbitrary value.  
`SPLITIO_API_KEY` : Api-Key for you Split Environment.  
`SPLITIO_DEBUG` : (Optional) Usable for enabling/disabling the logs of the SDK. By default they are off.  
`SPLITIO_SERVER_PORT` :  TCP Port of the server inside the container.

## Running the service with docker-compose
The sample below is content of a `docker-compose.yml`
```yaml
version: '2.1'

services:
  webservice:
    image: "splitsoftware/callhome:1.1"
    environment:
      - EXT_API_KEY=${SPLITIO_EXT_API_KEY}
      - API_KEY=${SPLITIO_API_KEY}
      - SPLITIO_DEBUG=${SPLITIO_DEBUG}      
    ports:
      - "${SPLITIO_PORT:-7548}:7548"
```
Just export env vars `SPLITIO_EXT_API_KEY`, `SPLITIO_API_KEY`, `SPLITIO_SERVER_PORT` and optionally `SPLITIO_DEBUG`, then run `docker-compose up`

## Build Docker Image
This command must be executed at root folder
`docker build -t splitsoftware/callhome:1.2 .`

## Push Docker Image
Before pushing image you must be logged in docker cloud. So run this command:
`docker login`
And push the image:
`docker push splitsoftware/callhome:1.2`

Pushing `latest` image. If tag is not explicit on `docker pull` command, the tag will be set by Docker engine as `latest`. So it is important create an image with this tag and push it.

```shell
docker build -t splitsoftware/callhome:latest .
docker push splitsoftware/callhome:latest
```
