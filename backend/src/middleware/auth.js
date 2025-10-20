const { verifyAdminToken, verifyTeamToken } = require('../auth/auth');
const { Team } = require('../models');

// Middleware para proteger rutas de admin
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyAdminToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para proteger rutas de equipos
const requireTeam = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const token = authHeader.substring(7);
    const team = await verifyTeamToken(token, Team);
    req.team = team;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de equipo inválido' });
  }
};

module.exports = {
  requireAdmin,
  requireTeam
};
