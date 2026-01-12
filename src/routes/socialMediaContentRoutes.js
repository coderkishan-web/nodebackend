const express = require('express');
const router = express.Router();
const { index, show, getBySubscription, store, update, updateStage, destroy } = require('../controllers/SocialMediaContentController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', index);
router.post('/', store);
router.get('/:id', show);
router.get('/subscription/:subscriptionId', getBySubscription);
router.put('/:id', update);
router.put('/:id/stage', updateStage);
router.delete('/:id', destroy);

module.exports = router;
