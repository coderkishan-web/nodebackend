const express = require('express');
const router = express.Router();
const { index, showBySlug, store, update, destroy } = require('../controllers/MockupController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route for viewing mockups by slug
router.get('/slug/:slug', showBySlug);
router.get('/:slug', showBySlug); // Direct slug access, but might conflict with others if not careful.
// Wait, Router.php regex `([\w\-]+)` matches anything. Node express runs roughly in order.
// If I iterate in Router.php: /slug/.. and then /...
// I should keep it simple.

router.get('/', index);
router.post('/', authenticate, upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'previewImageSS', maxCount: 10 }
]), store);
// Use POST for update with files
router.post('/:id', authenticate, upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'previewImageSS', maxCount: 10 }
]), update);
router.delete('/:id', authenticate, destroy);

module.exports = router;
