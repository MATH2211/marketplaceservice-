require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const servicoRoutes = require("./routes/servico.routes");


const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require("./routes/dashboard.routes");
const estabelecimentoRoutes = require("./routes/estabelecimento.routes");
const profissionalRoutes = require("./routes/profissional.routes");


//const cloudinaryRoutes = require('./routes/cloudinary.routes'); // se existir

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'../web')));

app.use('/admin', adminRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/estabelecimento", estabelecimentoRoutes);
//app.use('/cloudinary', cloudinaryRoutes); // rota para upload de imagens

app.use("/servicos", servicoRoutes);

app.use("/estabelecimento/profissionais",profissionalRoutes);



// Middleware global de erro (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando em http://192.168.0.109:${PORT}`);
  console.log(`API rodando em ${process.env.HOST}:${PORT}`);
});
