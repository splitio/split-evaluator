const express = require('express');
const router = express.Router();
const splitValidator = require('../utils/inputValidation/split');
const managerController = require('./manager.controller');
const { parseValidators } = require('../utils/utils');

/**
 * featureFlagValidation  performs input validation for manager call
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const featureFlagValidation = (req, res, next) => {
  const featureFlagNameValidation = splitValidator(req.query['split-name']);

  const error = parseValidators([featureFlagNameValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      featureFlagName: featureFlagNameValidation.value,
    };
  }

  next();
};

router.get('/split', featureFlagValidation, managerController.split);
router.get('/splits', managerController.splits);
router.get('/names', managerController.splitNames);

module.exports = router;
