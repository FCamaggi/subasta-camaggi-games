const { Round, Team, Bid, Transaction, sequelize } = require('../models');
const MinigameUsage = require('../models/MinigameUsage');

class SocketHandler {
    constructor(io) {
        this.io = io;
        this.activeIntervals = new Map(); // Para manejar rondas especiales
        this.inactivityTimers = new Map(); // Para auto-cierre por inactividad
        this.inactivityStartTimes = new Map(); // Cuando se inició el timer de cada ronda
        this.presentationTimers = new Map(); // Para manejar el tiempo de presentación
        this.INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutos en milisegundos (por defecto)
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado:', socket.id);

            // Cliente solicita estado actual de timers
            socket.on('client:requestTimerState', () => {
                console.log('📡 Cliente solicitó estado de timers');
                // Enviar todos los timers activos
                this.inactivityStartTimes.forEach((timeData, roundId) => {
                    socket.emit('round:timerUpdate', {
                        roundId,
                        expiresAt: timeData.expiresAt,
                        duration: this.INACTIVITY_TIMEOUT
                    });
                });
            });

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

                    const now = new Date();
                    const presentationTime = round.presentationTime || 30000; // 30 segundos por defecto
                    const presentationEndsAt = new Date(now.getTime() + presentationTime);

                    await round.update({
                        status: 'active',
                        startedAt: now,
                        presentationEndsAt: presentationEndsAt,
                        currentPrice: round.type === 'normal' ? round.minPrice : round.startingPrice
                    });

                    const updatedRound = await Round.findByPk(roundId, {
                        include: [{ model: Team, as: 'winner', attributes: ['id', 'name', 'color'] }]
                    });

                    // Notificar a todos los clientes
                    this.io.emit('round:started', updatedRound);

                    // Iniciar periodo de presentación (no se puede pujar)
                    console.log(`⏰ Iniciando periodo de presentación para ronda ${roundId} (${presentationTime / 1000}s)`);
                    
                    const presentationTimer = setTimeout(() => {
                        console.log(`✅ Periodo de presentación terminado para ronda ${roundId}`);
                        this.io.emit('round:presentationEnded', { roundId });
                        
                        // AHORA SÍ iniciamos el timer de inactividad
                        this.startInactivityTimer(roundId);
                        
                        // Si es ronda especial, iniciar descenso de precio
                        if (round.type === 'special') {
                            this.startPriceDecrement(round);
                        }
                    }, presentationTime);
                    
                    this.presentationTimers.set(roundId, presentationTimer);

                    // Notificar tiempo de presentación
                    this.io.emit('round:presentationStarted', {
                        roundId,
                        presentationEndsAt: presentationEndsAt.getTime(),
                        duration: presentationTime
                    });

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

                    // Cancelar timer de auto-cierre
                    this.cancelInactivityTimer(roundId);

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

            // Admin cambia el timeout de auto-cierre
            socket.on('admin:setInactivityTimeout', async (data) => {
                try {
                    const { minutes, token } = data;

                    // Validar que sea admin (simplificado)
                    if (!token) {
                        socket.emit('error', { message: 'No autorizado' });
                        return;
                    }

                    const newTimeout = minutes * 60 * 1000; // Convertir minutos a milisegundos

                    if (newTimeout < 30000) { // Mínimo 30 segundos
                        socket.emit('error', { message: 'El timeout mínimo es 30 segundos (0.5 minutos)' });
                        return;
                    }

                    if (newTimeout > 30 * 60 * 1000) { // Máximo 30 minutos
                        socket.emit('error', { message: 'El timeout máximo es 30 minutos' });
                        return;
                    }

                    this.INACTIVITY_TIMEOUT = newTimeout;
                    console.log(`⚙️ Timeout de inactividad cambiado a ${minutes} minutos`);

                    // Notificar a todos los clientes
                    this.io.emit('config:timeoutUpdated', {
                        minutes,
                        milliseconds: newTimeout
                    });

                    socket.emit('success', { message: `Timeout actualizado a ${minutes} minutos` });
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

                    // Verificar que el período de presentación haya terminado
                    if (round.presentationEndsAt && new Date() < new Date(round.presentationEndsAt)) {
                        const secondsLeft = Math.ceil((new Date(round.presentationEndsAt) - new Date()) / 1000);
                        socket.emit('error', { 
                            message: `Espera ${secondsLeft} segundos. Período de presentación en curso.` 
                        });
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

                    // Reiniciar timer de inactividad (cada puja resetea el timer)
                    this.startInactivityTimer(roundId);

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

                    // Cancelar timer de auto-cierre
                    this.cancelInactivityTimer(roundId);

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

            // Verificar si un equipo puede usar un minijuego
            socket.on('minigame:checkUsage', async ({ roundId, teamId }) => {
                try {
                    const usage = await MinigameUsage.findOne({
                        where: { roundId, teamId }
                    });

                    socket.emit('minigame:usageStatus', {
                        roundId,
                        teamId,
                        hasUsed: !!usage,
                        canUse: !usage
                    });
                } catch (error) {
                    socket.emit('error', { message: error.message });
                }
            });

            // Registrar uso de minijuego
            socket.on('minigame:registerUsage', async ({ roundId, teamId, minigameType, result }) => {
                try {
                    // Verificar que no se haya usado antes
                    const existingUsage = await MinigameUsage.findOne({
                        where: { roundId, teamId }
                    });

                    if (existingUsage) {
                        socket.emit('error', { message: 'Este minijuego ya fue usado para esta ronda' });
                        return;
                    }

                    // Registrar el uso
                    await MinigameUsage.create({
                        roundId,
                        teamId,
                        minigameType,
                        result
                    });

                    socket.emit('minigame:usageRegistered', {
                        roundId,
                        teamId,
                        minigameType
                    });

                    console.log(`✅ Minijuego usado: Team ${teamId}, Round ${roundId}, Type: ${minigameType}`);
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
        // Si hay período de presentación, el descenso inicia DESPUÉS de la presentación
        const startTime = round.presentationEndsAt 
            ? new Date(round.presentationEndsAt) 
            : new Date(round.startedAt);
        
        const elapsedMs = Math.max(0, clientTime - startTime); // No puede ser negativo
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

    // Iniciar timer de inactividad
    startInactivityTimer(roundId) {
        console.log(`⏰ Iniciando timer de inactividad para ronda ${roundId} (${this.INACTIVITY_TIMEOUT / 1000}s)`);

        // Cancelar timer anterior si existe
        this.cancelInactivityTimer(roundId);

        // Guardar el tiempo de inicio
        const startTime = Date.now();
        const expiresAt = startTime + this.INACTIVITY_TIMEOUT;
        this.inactivityStartTimes.set(roundId, { startTime, expiresAt });

        const timer = setTimeout(async () => {
            console.log(`⏰ Timer expirado para ronda ${roundId}, cerrando automáticamente...`);
            await this.autoCloseRound(roundId);
        }, this.INACTIVITY_TIMEOUT);

        this.inactivityTimers.set(roundId, timer);

        // Notificar a todos los clientes sobre el nuevo timer
        this.io.emit('round:timerUpdate', {
            roundId,
            expiresAt,
            duration: this.INACTIVITY_TIMEOUT
        });
    }

    // Cancelar timer de inactividad
    cancelInactivityTimer(roundId) {
        if (this.inactivityTimers.has(roundId)) {
            clearTimeout(this.inactivityTimers.get(roundId));
            this.inactivityTimers.delete(roundId);
            this.inactivityStartTimes.delete(roundId);
            console.log(`⏰ Timer de inactividad cancelado para ronda ${roundId}`);
            
            // Notificar que el timer fue cancelado
            this.io.emit('round:timerCancelled', { roundId });
        }
        
        // También cancelar timer de presentación si existe
        if (this.presentationTimers.has(roundId)) {
            clearTimeout(this.presentationTimers.get(roundId));
            this.presentationTimers.delete(roundId);
            console.log(`⏰ Timer de presentación cancelado para ronda ${roundId}`);
        }
    }    // Auto-cerrar ronda por inactividad
    async autoCloseRound(roundId) {
        try {
            const round = await Round.findByPk(roundId, {
                include: [{ model: Bid, as: 'bids', include: [{ model: Team, as: 'team' }] }]
            });

            if (!round || round.status !== 'active') {
                console.log(`⚠️ Ronda ${roundId} ya no está activa, cancelando auto-cierre`);
                return;
            }

            console.log(`🏁 Auto-cerrando ronda ${roundId} por inactividad...`);

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
            this.io.emit('round:autoCloseNotification', {
                roundId,
                reason: 'inactivity',
                message: 'Ronda cerrada automáticamente por inactividad (5 minutos)'
            });

            // Enviar balances actualizados
            const teams = await Team.findAll();
            this.io.emit('teams:updated', teams);

            console.log(`✅ Ronda ${roundId} cerrada automáticamente`);
        } catch (error) {
            console.error('❌ Error al auto-cerrar ronda:', error);
        }
    }
}

module.exports = SocketHandler;
