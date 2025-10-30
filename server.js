const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración del servidor HTTP
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const pacienteRoutes = require('./routes/paciente');
app.use('/api/pacientes', pacienteRoutes);

const citaRoutes = require('./routes/cita');
app.use('/api/citas', citaRoutes);

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI 
app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${port} y uri ${uri}`);
});
