const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/SocialMediaPlanController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', index);
router.post('/', store);
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
