const adminService = require('../services/admin.service');

async function register(req, res) {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const admin = await adminService.loginAdmin(req.body);
    res.status(200).json(admin);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = { register, login };