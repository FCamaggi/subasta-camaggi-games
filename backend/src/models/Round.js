const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Round = sequelize.define('Round', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['normal', 'special']]
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'active', 'closed']]
        }
    },
    minPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 100.00
    },
    currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    minIncrement: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 50.00
    },
    // Para rondas especiales
    startingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    priceDecrement: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 50.00
    },
    decrementInterval: {
        type: DataTypes.INTEGER, // en milisegundos
        allowNull: true,
        defaultValue: 1000 // 1 segundo
    },
    winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'teams',
            key: 'id'
        }
    },
    finalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    closedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    presentationTime: {
        type: DataTypes.INTEGER, // en milisegundos
        allowNull: false,
        defaultValue: 30000 // 30 segundos por defecto
    },
    presentationEndsAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    hasMinigame: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    minigameType: {
        type: DataTypes.STRING, // 'coinflip' o 'roulette'
        allowNull: true
    }
}, {
    tableName: 'rounds',
    timestamps: true
});

module.exports = Round;
