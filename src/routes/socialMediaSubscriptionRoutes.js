const express = require('express');
const router = express.Router();
const { index, show, getByClient, store, update, destroy } = require('../controllers/SocialMediaSubscriptionController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', index);
router.post('/', store);
router.get('/:id', show);
router.get('/client/:clientId', getByClient);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
