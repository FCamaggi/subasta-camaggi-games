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

        // Crear rondas si no existen
        const roundCount = await Round.count();

        if (roundCount === 0) {
            console.log('\n📝 Creando estructura de rondas...');

            let order = 1;

            // Primeras 4 rondas normales
            for (let i = 1; i <= 4; i++) {
                await Round.create({
                    title: `Ronda ${i}`,
                    description: `[Editar desde panel admin] Descripción de la ronda ${i}`,
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: order++
                });
            }

            // Primera ronda especial
            await Round.create({
                title: 'Ronda 5 (Especial)',
                description: '[Editar desde panel admin] Primera ronda con precio descendente',
                type: 'special',
                minPrice: 100,
                startingPrice: 1000,
                priceDecrement: 50,
                decrementInterval: 1000,
                order: order++
            });

            // Siguientes 4 rondas normales
            for (let i = 6; i <= 9; i++) {
                await Round.create({
                    title: `Ronda ${i}`,
                    description: `[Editar desde panel admin] Descripción de la ronda ${i}`,
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: order++
                });
            }

            // Segunda ronda especial
            await Round.create({
                title: 'Ronda 10 (Especial)',
                description: '[Editar desde panel admin] Segunda ronda con precio descendente',
                type: 'special',
                minPrice: 100,
                startingPrice: 1000,
                priceDecrement: 50,
                decrementInterval: 1000,
                order: order++
            });

            console.log('✅ Estructura de rondas creada (4 normales, 1 especial, 4 normales, 1 especial)');
            console.log('ℹ️  Edita los títulos, descripciones y precios desde el panel de administración');
        } else {
            console.log(`ℹ️  Ya existen ${roundCount} rondas en la base de datos`);
            console.log('ℹ️  Para recrear las rondas, elimina la base de datos:');
            console.log('   rm database.sqlite && npm run init-db');
        }

        console.log('\n✅ Inicialización completada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        process.exit(1);
    }
};

initializeData();
