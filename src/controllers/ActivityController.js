const Activity = require('../models/Activity');

const indexByProject = async (req, res) => {
    try {
        const activities = await Activity.getByProject(req.params.projectId);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching activities', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ message: 'Error creating activity', error: err.message });
    }
};

module.exports = { indexByProject, store };
