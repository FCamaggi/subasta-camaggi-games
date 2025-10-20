const express = require('express');
const { Team } = require('../models');
const router = express.Router();

// Login de equipo con token
router.post('/login', async (req, res) => {
  try {
    const { token } = req.body;
    const team = await Team.findOne({ where: { token } });
    
    if (!team) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    res.json({
      token: team.token,
      team: {
        id: team.id,
        name: team.name,
        color: team.color,
        balance: parseFloat(team.balance)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener info del equipo
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json({
      id: team.id,
      name: team.name,
      color: team.color,
      balance: parseFloat(team.balance)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los equipos (info pública)
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({
      attributes: ['id', 'name', 'color', 'balance']
    });
    
    res.json(teams.map(team => ({
      id: team.id,
      name: team.name,
      color: team.color,
      balance: parseFloat(team.balance)
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
