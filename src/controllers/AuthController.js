const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, role, client_id } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Incomplete data' });
    }

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(name, email, hashedPassword, role || 'admin', client_id || null);

        const payload = {
            id: userId,
            email: email,
            role: role || 'admin',
            client_id: client_id || null
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, name, email, role: role || 'admin', client_id: client_id || null }
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Incomplete data' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            client_id: user.client_id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                client_id: user.client_id
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { register, login, getMe };
