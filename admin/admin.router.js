const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

router.get('/ping', adminController.ping);
router.get('/healthcheck', adminController.healthcheck);
router.get('/version', adminController.version);
router.get('/machine', adminController.machine);
router.get('/uptime', adminController.uptime);
router.get('/stats', adminController.stats);

module.exports = router;
