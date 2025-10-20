const { Round, Team, Bid, Transaction, sequelize } = require('../models');

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.activeIntervals = new Map(); // Para manejar rondas especiales
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });

      // Admin inicia una ronda
      socket.on('admin:startRound', async (data) => {
        try {
          const { roundId, token } = data;
          
          // Verificar que es admin (simplificado para MVP)
          const round = await Round.findByPk(roundId);
          if (!round) {
            socket.emit('error', { message: 'Ronda no encontrada' });
            return;
          }

          if (round.status !== 'pending') {
            socket.emit('error', { message: 'La ronda ya fue iniciada' });
            return;
          }

          await round.update({
            status: 'active',
            startedAt: new Date(),
            currentPrice: round.type === 'normal' ? round.minPrice : round.startingPrice
          });

          const updatedRound = await Round.findByPk(roundId, {
            include: [{ model: Team, as: 'winner', attributes: ['id', 'name', 'color'] }]
          });

          // Notificar a todos los clientes
          this.io.emit('round:started', updatedRound);

          // Si es ronda especial, iniciar descenso de precio
          if (round.type === 'special') {
            this.startPriceDecrement(round);
          }
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Admin cierra una ronda
      socket.on('admin:closeRound', async (data) => {
        try {
          const { roundId } = data;
          
          const round = await Round.findByPk(roundId, {
            include: [{ model: Bid, as: 'bids', include: [{ model: Team, as: 'team' }] }]
          });

          if (!round) {
            socket.emit('error', { message: 'Ronda no encontrada' });
            return;
          }

          if (round.status !== 'active') {
            socket.emit('error', { message: 'La ronda no está activa' });
            return;
          }

          // Detener descenso de precio si es ronda especial
          if (this.activeIntervals.has(roundId)) {
            clearInterval(this.activeIntervals.get(roundId));
            this.activeIntervals.delete(roundId);
          }

          // Determinar ganador (última puja válida)
          let winner = null;
          let finalPrice = null;

          if (round.bids && round.bids.length > 0) {
            const lastBid = round.bids.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            )[0];
            
            winner = lastBid.team;
            finalPrice = lastBid.amount;

            // Descontar del balance del ganador
            await this.processWinnerTransaction(lastBid.teamId, roundId, finalPrice);
          }

          await round.update({
            status: 'closed',
            closedAt: new Date(),
            winnerId: winner ? winner.id : null,
            finalPrice: finalPrice
          });

          const updatedRound = await Round.findByPk(roundId, {
            include: [{ model: Team, as: 'winner', attributes: ['id', 'name', 'color'] }]
          });

          // Notificar a todos
          this.io.emit('round:closed', updatedRound);

          // Enviar balances actualizados
          const teams = await Team.findAll();
          this.io.emit('teams:updated', teams);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Equipo hace una puja
      socket.on('team:bid', async (data) => {
        try {
          const { roundId, teamId, amount, clientTimestamp } = data;

          const round = await Round.findByPk(roundId);
          const team = await Team.findByPk(teamId);

          if (!round || !team) {
            socket.emit('error', { message: 'Ronda o equipo no encontrado' });
            return;
          }

          if (round.status !== 'active') {
            socket.emit('error', { message: 'La ronda no está activa' });
            return;
          }

          if (parseFloat(team.balance) < parseFloat(amount)) {
            socket.emit('error', { message: 'Balance insuficiente' });
            return;
          }

          // Crear la puja
          const bid = await Bid.create({
            roundId,
            teamId,
            amount,
            clientTimestamp: clientTimestamp ? new Date(clientTimestamp) : null
          });

          // Actualizar precio actual
          await round.update({ currentPrice: amount });

          const bidWithTeam = await Bid.findByPk(bid.id, {
            include: [{ model: Team, as: 'team', attributes: ['id', 'name', 'color'] }]
          });

          // Notificar a todos
          this.io.emit('bid:new', bidWithTeam);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Equipo presiona STOP en ronda especial
      socket.on('team:stop', async (data) => {
        try {
          const { roundId, teamId, clientTimestamp } = data;

          const round = await Round.findByPk(roundId);
          const team = await Team.findByPk(teamId);

          if (!round || !team) {
            socket.emit('error', { message: 'Ronda o equipo no encontrado' });
            return;
          }

          if (round.status !== 'active' || round.type !== 'special') {
            socket.emit('error', { message: 'Acción no válida' });
            return;
          }

          // Calcular precio basado en el timestamp del cliente
          const price = this.calculatePriceAtTime(round, new Date(clientTimestamp));

          if (parseFloat(team.balance) < parseFloat(price)) {
            socket.emit('error', { message: 'Balance insuficiente' });
            return;
          }

          // Detener el descenso de precio
          if (this.activeIntervals.has(roundId)) {
            clearInterval(this.activeIntervals.get(roundId));
            this.activeIntervals.delete(roundId);
          }

          // Crear la "compra"
          const bid = await Bid.create({
            roundId,
            teamId,
            amount: price,
            clientTimestamp: new Date(clientTimestamp)
          });

          // Procesar transacción
          await this.processWinnerTransaction(teamId, roundId, price);

          // Cerrar la ronda
          await round.update({
            status: 'closed',
            closedAt: new Date(),
            winnerId: teamId,
            finalPrice: price
          });

          const updatedRound = await Round.findByPk(roundId, {
            include: [{ model: Team, as: 'winner', attributes: ['id', 'name', 'color'] }]
          });

          // Notificar a todos
          this.io.emit('round:closed', updatedRound);

          const teams = await Team.findAll();
          this.io.emit('teams:updated', teams);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
    });
  }

  startPriceDecrement(round) {
    const interval = setInterval(async () => {
      try {
        const currentRound = await Round.findByPk(round.id);
        
        if (!currentRound || currentRound.status !== 'active') {
          clearInterval(interval);
          this.activeIntervals.delete(round.id);
          return;
        }

        const newPrice = parseFloat(currentRound.currentPrice) - parseFloat(currentRound.priceDecrement);
        
        // Si llega al precio mínimo, detener
        if (newPrice <= parseFloat(currentRound.minPrice)) {
          await currentRound.update({ currentPrice: currentRound.minPrice });
          clearInterval(interval);
          this.activeIntervals.delete(round.id);
          this.io.emit('round:priceUpdate', {
            roundId: round.id,
            currentPrice: currentRound.minPrice,
            stopped: true
          });
          return;
        }

        await currentRound.update({ currentPrice: newPrice });
        
        this.io.emit('round:priceUpdate', {
          roundId: round.id,
          currentPrice: newPrice
        });
      } catch (error) {
        console.error('Error en descenso de precio:', error);
        clearInterval(interval);
        this.activeIntervals.delete(round.id);
      }
    }, round.decrementInterval || 1000);

    this.activeIntervals.set(round.id, interval);
  }

  calculatePriceAtTime(round, clientTime) {
    const startTime = new Date(round.startedAt);
    const elapsedMs = clientTime - startTime;
    const intervals = Math.floor(elapsedMs / round.decrementInterval);
    const totalDecrement = intervals * parseFloat(round.priceDecrement);
    const price = parseFloat(round.startingPrice) - totalDecrement;
    
    return Math.max(price, parseFloat(round.minPrice));
  }

  async processWinnerTransaction(teamId, roundId, amount) {
    const transaction = await sequelize.transaction();
    
    try {
      const team = await Team.findByPk(teamId, { transaction });
      const balanceBefore = parseFloat(team.balance);
      const balanceAfter = balanceBefore - parseFloat(amount);

      await team.update({ balance: balanceAfter }, { transaction });

      await Transaction.create({
        teamId,
        roundId,
        type: 'win',
        amount: parseFloat(amount),
        balanceBefore,
        balanceAfter,
        description: `Ganó la ronda`
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = SocketHandler;
