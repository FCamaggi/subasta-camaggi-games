const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this';

// Login de admin
const loginAdmin = async (username, password) => {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
        const token = jwt.sign(
            { role: 'admin', username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        return { token, role: 'admin' };
    }

    throw new Error('Credenciales inválidas');
};

// Verificar token de admin
const verifyAdminToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            throw new Error('No es admin');
        }
        return decoded;
    } catch (error) {
        throw new Error('Token inválido');
    }
};

// Verificar token de equipo
const verifyTeamToken = async (token, Team) => {
    try {
        const team = await Team.findOne({ where: { token } });
        if (!team) {
            throw new Error('Token de equipo inválido');
        }
        return team;
    } catch (error) {
        throw new Error('Token de equipo inválido');
    }
};

module.exports = {
    loginAdmin,
    verifyAdminToken,
    verifyTeamToken
};
