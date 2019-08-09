'use strict';

const express = require('express');
const router = express.Router();
const clientController = require('./client.controller');

router.get('/get-treatment', clientController.getTreatment);
router.get('/get-treatments', clientController.getTreatments);

module.exports = router;
