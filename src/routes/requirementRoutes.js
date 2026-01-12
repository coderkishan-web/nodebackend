const express = require('express');
const router = express.Router();
const { indexByProject, store, update, destroy } = require('../controllers/RequirementController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/project/:projectId', indexByProject);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
