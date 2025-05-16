const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

async function registerAdmin({ email, senha, username,nome,celular }) {

  const hashedPassword = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    'INSERT INTO administrador (email,senha,username,nome,celular) VALUES ($1, $2, $3, $4, $5) RETURNING id,email,username',
    [email,hashedPassword,username,nome,celular]
  );

  const admin = result.rows[0];
  const token = generateToken(admin.id);
  return { ...admin, token };
}

async function loginAdmin({ email, senha }) {
  const result = await pool.query('SELECT * FROM administrador WHERE email = $1', [email]);
  const admin = result.rows[0];

  if (!admin || !(await bcrypt.compare(senha, admin.senha))) {
    throw new Error('Credenciais inválidas');
  }

  const token = generateToken(admin.id);
  return { id: admin.id, username: admin.username, token };
}

module.exports = { registerAdmin, loginAdmin };
