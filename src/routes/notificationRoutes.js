const express = require('express');
const router = express.Router();
const { index, unreadCount, markRead, markAllRead } = require('../controllers/NotificationController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', index);
router.get('/unread-count', unreadCount);
router.put('/:id/read', markRead);
router.put('/mark-all-read', markAllRead);

module.exports = router;
