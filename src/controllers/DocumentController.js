const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

const indexByProject = async (req, res) => {
    try {
        const documents = await Document.getByProject(req.params.projectId);
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching documents', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const data = req.body;
        const file = req.file;

        const docData = {
            project_id: data.project_id,
            title: data.title || file.originalname,
            file_path: file.filename,
            file_type: path.extname(file.originalname).substring(1), // remove dot
            size_kb: Math.round(file.size / 1024)
        };

        const newDoc = await Document.create(docData);
        res.status(201).json(newDoc);
    } catch (err) {
        res.status(500).json({ message: 'Error uploading document', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        const document = await Document.getById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const filePath = path.join(__dirname, '../../uploads', document.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.delete(req.params.id);
        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting document', error: err.message });
    }
};

module.exports = { indexByProject, store, destroy };
