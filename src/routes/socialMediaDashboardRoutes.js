const express = require('express');
const router = express.Router();
const { getDashboard, getCalendar, getStats } = require('../controllers/SocialMediaDashboardController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/:subscriptionId', getDashboard);
router.get('/calendar/:subscriptionId/:month', getCalendar);
router.get('/stats/:subscriptionId', getStats);

module.exports = router;
