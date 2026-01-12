const Mockup = require('../models/Mockup');

const index = async (req, res) => {
    try {
        const mockups = await Mockup.findAll();
        res.json(mockups);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching mockups', error: err.message });
    }
};

const showBySlug = async (req, res) => {
    try {
        const mockup = await Mockup.findBySlug(req.params.slug);
        if (!mockup) {
            return res.status(404).json({ message: 'Mockup not found' });
        }
        res.json(mockup);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching mockup', error: err.message });
    }
};

const store = async (req, res) => {
    try {
        const data = req.body;
        let previewImage = '';
        let previewImageSS = [];

        if (req.files && req.files.previewImage) {
            previewImage = req.files.previewImage[0].filename;
        }

        if (req.files && req.files.previewImageSS) {
            previewImageSS = req.files.previewImageSS.map(file => file.filename);
        }

        const mockupData = {
            project_id: data.project_id || null,
            title: data.title,
            description: data.description || '',
            features: data.features || '',
            tags: data.tags || '',
            tool: data.tool || '',
            figmaLink: data.figmaLink || '',
            mockupLink: data.mockupLink || '',
            previewImage: previewImage,
            previewImageSS: JSON.stringify(previewImageSS),
            slug: data.slug,
            status: data.status || 'Draft',
            visibility: data.visibility || 'Internal'
        };

        const id = await Mockup.create(mockupData);
        res.status(201).json({ message: 'Mockup created successfully', id });
    } catch (err) {
        res.status(500).json({ message: 'Error creating mockup', error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const existing = await Mockup.getById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Mockup not found' });
        }

        const data = req.body;
        let previewImage = existing.previewImage;
        let previewImageSS = JSON.parse(existing.previewImageSS || '[]');

        if (req.files && req.files.previewImage) {
            previewImage = req.files.previewImage[0].filename;
        }

        if (req.files && req.files.previewImageSS) {
            const newFiles = req.files.previewImageSS.map(file => file.filename);
            // Logic from PHP was to replace or append? 
            // PHP: $newFiles[] = ...; $previewImageSS = $newFiles; (It replaced)
            // I will replace too.
            previewImageSS = newFiles;
        }

        const mockupData = {
            project_id: data.project_id || existing.project_id,
            title: data.title || existing.title,
            description: data.description || existing.description,
            features: data.features || existing.features,
            tags: data.tags || existing.tags,
            tool: data.tool || existing.tool,
            figmaLink: data.figmaLink || existing.figmaLink,
            mockupLink: data.mockupLink || existing.mockupLink,
            previewImage: previewImage,
            previewImageSS: JSON.stringify(previewImageSS),
            slug: data.slug || existing.slug,
            status: data.status || existing.status,
            visibility: data.visibility || existing.visibility
        };

        await Mockup.update(req.params.id, mockupData);
        res.json({ message: 'Mockup updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating mockup', error: err.message });
    }
};

const destroy = async (req, res) => {
    try {
        await Mockup.delete(req.params.id);
        res.json({ message: 'Mockup deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting mockup', error: err.message });
    }
};

module.exports = { index, showBySlug, store, update, destroy };
