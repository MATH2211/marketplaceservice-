// utils/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id; // coloca o id no req para ser usado nos controllers
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido' });
    }
}

module.exports = verifyToken;