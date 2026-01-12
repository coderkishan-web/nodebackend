const db = require('../config/db');

const getStats = async (req, res) => {
    try {
        // Parallel queries
        const [mockups] = await db.query('SELECT COUNT(*) as count FROM mockups');
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        const [projects] = await db.query('SELECT COUNT(*) as count FROM projects');
        const [clients] = await db.query('SELECT COUNT(*) as count FROM clients');

        res.json({
            mockups: mockups[0].count,
            users: users[0].count,
            projects: projects[0].count,
            clients: clients[0].count,
            role: "admin"
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
};

module.exports = { getStats };
