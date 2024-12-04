const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const userExists = await User.findOne({ email });
            
            if (userExists) {
                return res.status(400).json({ message: 'Usuario ya existe' });
            }

            const user = await User.create({ name, email, password });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                token
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                });

                res.json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    token
                });
            } else {
                res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;