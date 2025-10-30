const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuraciones
app.use(bodyParser.json());
app.use(cors());

// ✅ CONEXIÓN CORREGIDA - Sin opciones deprecadas y con configuración SSL
mongoose.connect(process.env.MONGODB_URI, {
  // Elimina las opciones deprecadas
  // useNewUrlParser: true,    // ❌ REMOVER
  // useUnifiedTopology: true, // ❌ REMOVER
  
  // ✅ Añade estas opciones para SSL
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  
  // Timeouts
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  
  // Reintentos
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 1
})
.then(() => {
  console.log('✅ Conectado a MongoDB Atlas exitosamente');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error.message);
  // No salir del proceso, permitir que el servidor funcione
});

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado');
});

// Ruta de salud que funciona incluso sin MongoDB
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'OK', 
    database: dbStatus,
    timestamp: new Date().toISOString(),
    message: 'Servidor funcionando correctamente'
  });
});

// Ruta de test simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando',
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
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

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${port}`);
  console.log(`💊 Health check: https://apipacientes-ew5d.onrender.com/health`);
  console.log(`🧪 Test: https://apipacientes-ew5d.onrender.com/api/test`);
});
