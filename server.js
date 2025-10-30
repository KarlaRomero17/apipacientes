const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando SIN MongoDB' });
});

app.post('/api/auth/login', (req, res) => {
  // Respuesta temporal para login
  res.json({ message: 'Login endpoint - MongoDB no disponible' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor en puerto ${port} (sin MongoDB)`);
});
