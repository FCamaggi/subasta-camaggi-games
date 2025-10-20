const express = require('express');
const { Bid, Round, Team } = require('../models');
const { requireTeam } = require('../middleware/auth');
const router = express.Router();

// Obtener pujas de una ronda
router.get('/round/:roundId', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { roundId: req.params.roundId },
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'color']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear puja (requiere autenticación de equipo)
router.post('/', requireTeam, async (req, res) => {
  try {
    const { roundId, amount, clientTimestamp } = req.body;
    const teamId = req.team.id;
    
    const round = await Round.findByPk(roundId);
    if (!round) {
      return res.status(404).json({ error: 'Ronda no encontrada' });
    }
    
    if (round.status !== 'active') {
      return res.status(400).json({ error: 'La ronda no está activa' });
    }
    
    // Validar que el equipo tenga suficiente balance
    const team = await Team.findByPk(teamId);
    if (parseFloat(team.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Balance insuficiente' });
    }
    
    // Para rondas normales, validar incremento mínimo
    if (round.type === 'normal') {
      const currentPrice = round.currentPrice || round.minPrice;
      const minNextPrice = parseFloat(currentPrice) + parseFloat(round.minIncrement);
      
      if (parseFloat(amount) < minNextPrice) {
        return res.status(400).json({ 
          error: `La puja debe ser al menos ${minNextPrice}` 
        });
      }
    }
    
    const bid = await Bid.create({
      roundId,
      teamId,
      amount,
      clientTimestamp: clientTimestamp ? new Date(clientTimestamp) : null
    });
    
    // Actualizar precio actual de la ronda
    await round.update({ currentPrice: amount });
    
    // Cargar la puja con el equipo para responder
    const bidWithTeam = await Bid.findByPk(bid.id, {
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'color']
        }
      ]
    });
    
    res.status(201).json(bidWithTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
