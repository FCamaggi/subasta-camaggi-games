const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roundId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rounds',
      key: 'id'
    }
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  clientTimestamp: {
    type: DataTypes.DATE,
    allowNull: true // Solo para rondas especiales
  }
}, {
  tableName: 'bids',
  timestamps: true
});

module.exports = Bid;
