const express = require('express');
const router = express.Router();
const splitValidator = require('../utils/inputValidation/split');
const managerController = require('./manager.controller');
const { parseValidators } = require('../utils/utils');

const splitValidation = (req, res, next) => {
  const splitNameValidation = splitValidator(req.query['split-name']);

  const error = parseValidators([splitNameValidation]);
  if (error.length) {
    return res
      .status(400)
      .send({
        error,
      });
  } else {
    req.splitio = {
      splitName: splitNameValidation.value,
    };
  }

  next();
};

router.get('/split', splitValidation, managerController.split);
router.get('/splits', managerController.splits);
router.get('/names', managerController.splitNames);

module.exports = router;
