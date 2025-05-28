require('dotenv').config();

const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require("./routes/dashboard.routes");
const estabelecimentoRoutes = require("./routes/estabelecimento.routes")

const cors = require('cors');
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'../web')));


app.use('/admin', adminRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/estabelecimento",estabelecimentoRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`API rodando em http://192.168.0.109:${PORT}`);
  console.log(`API rodando em ${process.env.HOST}:${PORT}`)
});