const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');

// Configurar variables de entorno
dotenv.config();

// Conectar a la base de datos solo si no es entorno de test
if (process.env.NODE_ENV !== 'test') {
  conectarDB();
}

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Exportar app sin iniciar el servidor
module.exports = app;
