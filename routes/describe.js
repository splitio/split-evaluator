
/**
 * To be mounted at /describe
 */
const express = require('express');
const router = express.Router();

router.get('/get-treatment', (req, res) => {
  res.type('text').send(`
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
      curl 'http://localhost:4444/get-treatment?key=my-customer-key&split-name=my-experiment
      &attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization={SPLITIO_EXT_API_KEY}'
  `);
});

router.get('/get-treatments', (req, res) => {  
  res.type('text').send(`
    GET
      /get-treatments

    QUERY PARAMS
       keys:
         This is the array of keys to be used in the getTreatments call. Each key should specify a "matchingKey" 
         and a "trafficType". You can also specify a "bucketingKey".
       attributes:
         (Optional) This should be a json string of the attributes you want to include in the getTreatments call.

     EXAMPLE
       curl 'http://localhost:4444/get-treatments?keys=\[\{"matchingKey":"my-first-key","trafficType":"account"\},
       \{"matchingKey":"my-second-key","bucketingKey":"my-bucketing-key","trafficType":"user"\}\]
       &attributes=\{"attribute1":"one","attribute2":2,"attribute3":true\}' -H 'Authorization={SPLITIO_EXT_API_KEY}'
  `);
});

module.exports = router;


