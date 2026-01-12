const SocialMediaContent = require('../models/SocialMediaContent');

const index = async (req, res) => {
    try {
        const filters = req.query; // Express query parser handles this well
        const content = await SocialMediaContent.getAll(filters);
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching content', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const content = await SocialMediaContent.getById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching content', error: err.message });
    }
};

const getBySubscription = async (req, res) => {
    try {
        const content = await SocialMediaContent.getBySubscriptionId(req.params.subscriptionId);
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching content', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const data = req.body;
        if (!data.subscription_id || !data.content_type || !data.title) {
            return res.status(400).json({ message: 'subscription_id, content_type, and title are required' });
        }
        const newContent = await SocialMediaContent.create(data);
        res.status(201).json(newContent);
    } catch (err) {
        res.status(500).json({ message: 'Error creating content', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const content = await SocialMediaContent.getById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        await SocialMediaContent.update(req.params.id, req.body);
        res.json({ message: 'Content updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating content', error: err.message });
    }
};

const updateStage = async (req, res) => {
    try {
        const content = await SocialMediaContent.getById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        if (!req.body.stage) {
            return res.status(400).json({ message: 'stage is required' });
        }
        await SocialMediaContent.updateStage(req.params.id, req.body.stage, req.body.user_id);
        res.json({ message: 'Stage updated successfully', new_stage: req.body.stage });
    } catch (err) {
        res.status(500).json({ message: 'Error updating stage', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        const content = await SocialMediaContent.getById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        await SocialMediaContent.delete(req.params.id);
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting content', error: err.message });
    }
};

module.exports = { index, show, getBySubscription, store, update, updateStage, destroy };
