require('dotenv').config();
const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin.routes');
const estabelecimentoRotes = require("./routes/estabelecimento.routes");


app.use(express.json());
app.use('/admin', adminRoutes);
app.use("/estabelecimento",estabelecimentoRotes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});