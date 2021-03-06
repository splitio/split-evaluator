const express = require('express');
const router = express.Router();
const keyValidator = require('../utils/inputValidation/key');
const splitValidator = require('../utils/inputValidation/split');
const splitsValidator = require('../utils/inputValidation/splits');
const attributesValidator = require('../utils/inputValidation/attributes');
const trafficTypeValidator = require('../utils/inputValidation/trafficType');
const eventTypeValidator = require('../utils/inputValidation/eventType');
const valueValidator = require('../utils/inputValidation/value');
const propertiesValidator = require('../utils/inputValidation/properties');
const keysValidator = require('../utils/inputValidation/keys');
const clientController = require('./client.controller');
const { parseValidators } = require('../utils/utils');

/**
 * treatmentValidation  performs input validation for treatment call.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const treatmentValidation = (req, res, next) => {
  const matchingKeyValidation = keyValidator(req.query.key, 'key');
  const bucketingKeyValidation = req.query['bucketing-key'] !== undefined ? keyValidator(req.query['bucketing-key'], 'bucketing-key') : null;
  const splitNameValidation = splitValidator(req.query['split-name']);
  const attributesValidation = attributesValidator(req.query.attributes);

  const error = parseValidators([matchingKeyValidation, bucketingKeyValidation, splitNameValidation, attributesValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      matchingKey: matchingKeyValidation.value,
      splitName: splitNameValidation.value,
      attributes: attributesValidation.value,
    };

    if (bucketingKeyValidation && bucketingKeyValidation.valid) req.splitio.bucketingKey = bucketingKeyValidation.value;
  }

  next();
};

/**
 * treatmentsValidation performs input validation for treatments call.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const treatmentsValidation = (req, res, next) => {
  const matchingKeyValidation = keyValidator(req.query.key, 'key');
  const bucketingKeyValidation = req.query['bucketing-key'] !== undefined ? keyValidator(req.query['bucketing-key'], 'bucketing-key') : null;
  const splitNamesValidation = splitsValidator(req.query['split-names']);
  const attributesValidation = attributesValidator(req.query.attributes);

  const error = parseValidators([matchingKeyValidation, bucketingKeyValidation, splitNamesValidation, attributesValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      matchingKey: matchingKeyValidation.value,
      splitNames: splitNamesValidation.value,
      attributes: attributesValidation.value,
    };

    if (bucketingKeyValidation && bucketingKeyValidation.valid) req.splitio.bucketingKey = bucketingKeyValidation.value;
  }

  next();
};

/**
 * trackValidation  performs input validation for event tracking calls.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const trackValidation = (req, res, next) => {
  const keyValidation = keyValidator(req.query.key, 'key');
  const trafficTypeValidation = trafficTypeValidator(req.query['traffic-type']);
  const eventTypeValidation = eventTypeValidator(req.query['event-type']);
  const valueValidation = valueValidator(req.query.value);
  const propertiesValidation = propertiesValidator(req.query.properties);

  const error = parseValidators([keyValidation, trafficTypeValidation, eventTypeValidation, valueValidation, propertiesValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      key: keyValidation.value,
      trafficType: trafficTypeValidation.value,
      eventType: eventTypeValidation.value,
      value: valueValidation.value,
      properties: propertiesValidation.value,
    };
  }

  next();
};

/**
 * allTreatmentValidation performs input validation for all treatments call.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const allTreatmentValidation = (req, res, next) => {
  const keysValidation = keysValidator(req.query.keys);
  const attributesValidation = attributesValidator(req.query.attributes);

  const error = parseValidators([keysValidation, attributesValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      keys: keysValidation.value,
      attributes: attributesValidation.value,
    };
  }

  next();
};

router.get('/get-treatment', treatmentValidation, clientController.getTreatment);
router.get('/get-treatment-with-config', treatmentValidation, clientController.getTreatmentWithConfig);
router.get('/get-treatments', treatmentsValidation, clientController.getTreatments);
router.get('/get-treatments-with-config', treatmentsValidation, clientController.getTreatmentsWithConfig);
router.get('/track', trackValidation, clientController.track);
router.get('/get-all-treatments', allTreatmentValidation, clientController.getAllTreatments);
router.get('/get-all-treatments-with-config', allTreatmentValidation, clientController.getAllTreatmentsWithConfig);

module.exports = router;
