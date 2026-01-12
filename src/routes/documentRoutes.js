const express = require('express');
const router = express.Router();
const { indexByProject, store, destroy } = require('../controllers/DocumentController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticate);

router.get('/project/:projectId', indexByProject);
router.post('/upload', upload.single('file'), store);
router.delete('/:id', destroy);

module.exports = router;
