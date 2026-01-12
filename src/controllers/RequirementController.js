const Requirement = require('../models/Requirement');

const indexByProject = async (req, res) => {
    try {
        const requirements = await Requirement.getByProjectId(req.params.projectId);
        res.json(requirements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching requirements', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const newReq = await Requirement.create(req.body);
        res.status(201).json(newReq);
    } catch (err) {
        res.status(500).json({ message: 'Error creating requirement', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        await Requirement.update(req.params.id, req.body);
        res.json({ message: 'Requirement updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating requirement', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        await Requirement.delete(req.params.id);
        res.json({ message: 'Requirement deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting requirement', error: err.message });
    }
};

module.exports = { indexByProject, store, update, destroy };
