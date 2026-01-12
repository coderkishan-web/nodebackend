const Invoice = require('../models/Invoice');

const index = async (req, res) => {
    try {
        const invoices = await Invoice.getAll();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoices', error: err.message });
    }
};

const show = async (req, res) => {
    try {
        const invoice = await Invoice.getById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoice', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const newInvoice = await Invoice.create(req.body);
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(500).json({ message: 'Error creating invoice', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        await Invoice.update(req.params.id, req.body);
        res.json({ message: 'Invoice updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating invoice', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        await Invoice.delete(req.params.id);
        res.json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting invoice', error: err.message });
    }
};

module.exports = { index, show, store, update, destroy };
