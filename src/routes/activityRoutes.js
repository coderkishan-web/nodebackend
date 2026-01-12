const express = require('express');
const router = express.Router();
const { indexByProject, store } = require('../controllers/ActivityController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/project/:projectId', indexByProject);
router.post('/', store);

module.exports = router;
