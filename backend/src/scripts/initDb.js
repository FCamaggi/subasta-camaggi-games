const { Team, Round, initDatabase } = require('../models');
const crypto = require('crypto');

const initializeData = async () => {
    try {
        await initDatabase();

        // Crear equipos si no existen
        const teamCount = await Team.count();

        if (teamCount === 0) {
            console.log('📝 Creando equipos...');

            const blueToken = crypto.randomBytes(16).toString('hex');
            const redToken = crypto.randomBytes(16).toString('hex');

            await Team.create({
                name: 'Equipo Azul',
                color: 'blue',
                token: blueToken,
                balance: 10000,
                initialBalance: 10000
            });

            await Team.create({
                name: 'Equipo Rojo',
                color: 'red',
                token: redToken,
                balance: 10000,
                initialBalance: 10000
            });

            console.log('✅ Equipos creados');
            console.log(`
╔════════════════════════════════════════╗
║         TOKENS DE ACCESO               ║
╚════════════════════════════════════════╝

🔵 Equipo Azul:
   Token: ${blueToken}

🔴 Equipo Rojo:
   Token: ${redToken}

⚠️  GUARDA ESTOS TOKENS DE FORMA SEGURA
      `);
        } else {
            console.log('ℹ️  Los equipos ya existen');
            const teams = await Team.findAll();
            console.log('\nTokens actuales:');
            teams.forEach(team => {
                console.log(`${team.color === 'blue' ? '🔵' : '🔴'} ${team.name}: ${team.token}`);
            });
        }

        // Crear rondas de ejemplo si no existen
        const roundCount = await Round.count();

        if (roundCount === 0) {
            console.log('\n📝 Creando rondas de ejemplo...');

            // 8 rondas normales
            for (let i = 1; i <= 8; i++) {
                await Round.create({
                    title: `Ronda Normal ${i}`,
                    description: `Descripción de la ronda ${i}`,
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: i
                });
            }

            // 2 rondas especiales
            await Round.create({
                title: 'Ronda Especial 1',
                description: 'Primera ronda con precio descendente',
                type: 'special',
                minPrice: 100,
                startingPrice: 2000,
                priceDecrement: 50,
                decrementInterval: 1000,
                order: 9
            });

            await Round.create({
                title: 'Ronda Especial 2',
                description: 'Segunda ronda con precio descendente',
                type: 'special',
                minPrice: 200,
                startingPrice: 3000,
                priceDecrement: 100,
                decrementInterval: 1000,
                order: 10
            });

            console.log('✅ Rondas de ejemplo creadas');
        } else {
            console.log('ℹ️  Las rondas ya existen');
        }

        console.log('\n✅ Inicialización completada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        process.exit(1);
    }
};

initializeData();
