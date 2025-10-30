const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // ✅ AÑADE ESTA LÍNEA

const app = express();

// Configuraciones a servidor http
app.use(bodyParser.json());
app.use(cors());

// ✅ CONEXIÓN CORREGIDA - elimina las opciones deprecadas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1); // Sale del proceso si no puede conectar
  });

// Manejo de eventos de conexión (opcional pero recomendado)
mongoose.connection.on('error', (err) => {
  console.error('Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

// Rutas para auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas para paciente
const pacienteRoutes = require('./routes/paciente');
app.use('/api/pacientes', pacienteRoutes); 

// Rutas para citas
const citaRoutes = require('./routes/cita');
app.use('/api/citas', citaRoutes);

// Ruta de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${port}`);
});
