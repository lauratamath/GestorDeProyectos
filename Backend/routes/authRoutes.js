// backend/routes/authRoutes.js

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

        // Log para debugging
        console.log('Datos recibidos:', { name, email, password: '***' });

        const user = new User({ name, email, password });
        await user.save();
        console.log('Usuario guardado exitosamente');
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error('Error detallado:', err);
        res.status(500).json({ 
            error: 'Error al registrar usuario', 
            details: err.message,
            code: err.code
        });
    }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ msg: 'Por favor ingrese todos los campos' });
        }

        // Verificar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Crear y firmar un token de sesión
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token válido por 1 hora
        });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

module.exports = router;
