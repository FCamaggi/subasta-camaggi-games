const sequelize = require('../config/database');
const Team = require('./Team');
const Round = require('./Round');
const Bid = require('./Bid');
const Transaction = require('./Transaction');

// Relaciones
Team.hasMany(Bid, { foreignKey: 'teamId', as: 'bids' });
Bid.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

Round.hasMany(Bid, { foreignKey: 'roundId', as: 'bids' });
Bid.belongsTo(Round, { foreignKey: 'roundId', as: 'round' });

Round.belongsTo(Team, { foreignKey: 'winnerId', as: 'winner' });
Team.hasMany(Round, { foreignKey: 'winnerId', as: 'wonRounds' });

Team.hasMany(Transaction, { foreignKey: 'teamId', as: 'transactions' });
Transaction.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

Round.hasMany(Transaction, { foreignKey: 'roundId', as: 'transactions' });
Transaction.belongsTo(Round, { foreignKey: 'roundId', as: 'round' });

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a base de datos establecida');
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados');
    } catch (error) {
        console.error('❌ Error en base de datos:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    Team,
    Round,
    Bid,
    Transaction,
    initDatabase
};
