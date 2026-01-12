const Notification = require('../models/Notification');

const index = async (req, res) => {
    try {
        const notifications = await Notification.getByUser(req.user.id);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications', error: err.message });
    }
};

const unreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user.id);
        res.json({ count: Number(count) });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching unread count', error: err.message });
    }
};

const markRead = async (req, res) => {
    try {
        await Notification.markAsRead(req.params.id);
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Error marking notification as read', error: err.message });
    }
};

const markAllRead = async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user.id);
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Error marking all read', error: err.message });
    }
};

module.exports = { index, unreadCount, markRead, markAllRead };
