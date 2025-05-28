require('dotenv').config();
const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(express.json());

// Rotas
app.use('/api', uploadRoutes);

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
