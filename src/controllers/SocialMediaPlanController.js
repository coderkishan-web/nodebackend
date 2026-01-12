const SocialMediaPlan = require('../models/SocialMediaPlan');

const index = async (req, res) => {
    try {
        const activeOnly = req.query.active_only === 'true';
        let plans;
        if (activeOnly) {
            plans = await SocialMediaPlan.getActivePlans();
        } else {
            plans = await SocialMediaPlan.getAll();
        }
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plans', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const plan = await SocialMediaPlan.getById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plan', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const data = req.body;
        if (!data.plan_name || !data.plan_price) {
            return res.status(400).json({ message: 'plan_name and plan_price are required' });
        }
        const newPlan = await SocialMediaPlan.create(data);
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ message: 'Error creating plan', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const plan = await SocialMediaPlan.getById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        await SocialMediaPlan.update(req.params.id, req.body);
        res.json({ message: 'Plan updated successfully' }); // PHP returned updatedPlan, but update returns void/bool in model. I'll return success message or fetch again. PHP returned updated data passed in.
    } catch (err) {
        res.status(500).json({ message: 'Error updating plan', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        const plan = await SocialMediaPlan.getById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        await SocialMediaPlan.softDelete(req.params.id);
        res.json({ message: 'Plan deactivated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting plan', error: err.message });
    }
};

module.exports = { index, show, store, update, destroy };
