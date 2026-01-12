const Project = require('../models/Project');

const index = async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const project = await Project.getById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        await Project.update(req.params.id, req.body);
        res.json({ message: 'Project updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
};

module.exports = { index, show, store, update, destroy };
