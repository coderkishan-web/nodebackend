const express = require('express');
const router = express.Router();
const { getRevenueByMonth, getProjectsByStatus, getInvoicesByStatus, getTopClients } = require('../controllers/AnalyticsController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/revenue-by-month', getRevenueByMonth);
router.get('/projects-by-status', getProjectsByStatus);
router.get('/invoices-by-status', getInvoicesByStatus);
router.get('/top-clients', getTopClients);

module.exports = router;
