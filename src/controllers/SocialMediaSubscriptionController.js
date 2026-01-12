const SocialMediaSubscription = require('../models/SocialMediaSubscription');

const index = async (req, res) => {
    try {
        const subscriptions = await SocialMediaSubscription.getAll();
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const subscription = await SocialMediaSubscription.getById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching subscription', error: err.message });
    }
};

const getByClient = async (req, res) => {
    try {
        const subscription = await SocialMediaSubscription.getActiveByClientId(req.params.clientId);
        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found for this client' });
        }
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching subscription', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const data = req.body;
        if (!data.client_id || !data.plan_id || !data.start_date || !data.end_date) {
            return res.status(400).json({ message: 'client_id, plan_id, start_date, and end_date are required' });
        }
        const newSubscription = await SocialMediaSubscription.create(data);
        res.status(201).json(newSubscription);
    } catch (err) {
        res.status(500).json({ message: 'Error creating subscription', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const subscription = await SocialMediaSubscription.getById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        await SocialMediaSubscription.update(req.params.id, req.body);
        res.json({ message: 'Subscription updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating subscription', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        const subscription = await SocialMediaSubscription.getById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        await SocialMediaSubscription.cancel(req.params.id);
        res.json({ message: 'Subscription cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error cancelling subscription', error: err.message });
    }
};

module.exports = { index, show, getByClient, store, update, destroy };
