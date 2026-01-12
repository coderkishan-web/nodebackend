const Client = require('../models/Client');

const index = async (req, res) => {
    try {
        const clients = await Client.getAll();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching clients', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const client = await Client.getById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching client', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(500).json({ message: 'Error creating client', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        await Client.update(req.params.id, req.body);
        res.json({ message: 'Client updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating client', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        await Client.delete(req.params.id);
        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting client', error: err.message });
    }
};

module.exports = { index, show, store, update, destroy };
