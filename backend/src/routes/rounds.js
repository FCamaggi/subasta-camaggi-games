const express = require('express');
const { Round, Team, Bid } = require('../models');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Crear ronda (solo admin)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const round = await Round.create(req.body);
        res.status(201).json(round);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las rondas
router.get('/', async (req, res) => {
    try {
        const rounds = await Round.findAll({
            include: [
                {
                    model: Team,
                    as: 'winner',
                    attributes: ['id', 'name', 'color']
                }
            ],
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(rounds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener ronda específica
router.get('/:id', async (req, res) => {
    try {
        const round = await Round.findByPk(req.params.id, {
            include: [
                {
                    model: Team,
                    as: 'winner',
                    attributes: ['id', 'name', 'color']
                },
                {
                    model: Bid,
                    as: 'bids',
                    include: [
                        {
                            model: Team,
                            as: 'team',
                            attributes: ['id', 'name', 'color']
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!round) {
            return res.status(404).json({ error: 'Ronda no encontrada' });
        }

        res.json(round);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar ronda (solo admin)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const round = await Round.findByPk(req.params.id);
        if (!round) {
            return res.status(404).json({ error: 'Ronda no encontrada' });
        }

        await round.update(req.body);
        res.json(round);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar ronda (solo admin)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const round = await Round.findByPk(req.params.id);
        if (!round) {
            return res.status(404).json({ error: 'Ronda no encontrada' });
        }

        if (round.status !== 'pending') {
            return res.status(400).json({ error: 'Solo se pueden eliminar rondas pendientes' });
        }

        await round.destroy();
        res.json({ message: 'Ronda eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
