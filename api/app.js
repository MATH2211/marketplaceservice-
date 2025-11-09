require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// Importação das rotas
const servicoRoutes = require("./routes/servico.routes");
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require("./routes/dashboard.routes");
const estabelecimentoRoutes = require("./routes/estabelecimento.routes");
const profissionalRoutes = require("./routes/profissional.routes");
const horariosRoutes = require('./routes/horarios.routes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'../web')));

// Configuração das rotas
app.use('/admin', adminRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/estabelecimento", estabelecimentoRoutes);
app.use("/servicos", servicoRoutes);
app.use('/estabelecimento/profissionais', profissionalRoutes);
app.use("/estabelecimento/horarios", horariosRoutes);

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Configuração do servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`API rodando em http://${HOST}:${PORT}`);
});