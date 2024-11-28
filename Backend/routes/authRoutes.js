const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error('Error detallado:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor ingrese todos los campos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'El usuario no existe' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
});

//Usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();  // Obtiene todos los usuarios
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
