const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MinigameUsage = sequelize.define('MinigameUsage', {
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
    minigameType: {
        type: DataTypes.STRING, // 'coinflip' o 'roulette'
        allowNull: false
    },
    usedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    result: {
        type: DataTypes.JSON, // Almacenar el resultado del minijuego
        allowNull: true
    }
}, {
    tableName: 'minigame_usages',
    timestamps: true
});

module.exports = MinigameUsage;
