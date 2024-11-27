const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

// Verificar que las variables de entorno estén definidas
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI no está definida en el archivo .env');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Mostrar URI (con contraseña oculta) para debugging
const safeUri = process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@');
console.log('Intentando conectar a:', safeUri);

// Conectar a MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('MongoDB conectado exitosamente');
        // Verificar que estamos conectados a la base de datos correcta
        console.log('Base de datos:', mongoose.connection.name);
    })
    .catch((err) => {
        console.error('Error detallado al conectar MongoDB:', {
            nombre: err.name,
            mensaje: err.message,
            código: err.code,
            detalles: err.reason,
            // Agregar más información de debug
            stack: err.stack
        });
        process.exit(1);
    });
// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));