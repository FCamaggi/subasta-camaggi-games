const { Team, Round, initDatabase } = require('../models');
const MinigameUsage = require('../models/MinigameUsage');
const crypto = require('crypto');

const initializeData = async () => {
    try {
        await initDatabase();
        
        // Sincronizar modelo MinigameUsage
        await MinigameUsage.sync({ force: false });

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
            console.log('\n📝 Creando rondas personalizadas...');

            const rounds = [
                {
                    title: 'Mano de Host',
                    description: 'El equipo ganador de este item recibe la ayuda del host en ese momento, el host decidirá como será esta ayuda y todo lo relacionado con ella',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 1,
                    presentationTime: 30000
                },
                {
                    title: 'Doble [Filo]',
                    description: 'El equipo ganador de este item puede utilizarlo para hacer que la siguiente ronda de un juego presencial valga el doble de puntos, ya sea puntos de alianza o puntos del juego, el host verá como aplicarlo satisfactoriamente, siempre se debe aplicar antes de jugar',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 2,
                    presentationTime: 30000
                },
                {
                    title: 'Mistery Box',
                    description: 'Un premio sorpresa que será indicado por el host al líder de la alianza que lo compró',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 3,
                    presentationTime: 30000
                },
                {
                    title: 'Roba turno',
                    description: 'El equipo ganador puede usar este item en el evento principal para robar el turno, ya sea para partir ellos, elegir ellos una categoria, etc, el host debe adecuarlo para un buen uso, nunca se usará con una ronda en progreso',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 4,
                    presentationTime: 30000
                },
                {
                    title: '10 Puntos de Alianza',
                    description: '10 puntos para la alianza que gane este item',
                    type: 'special',
                    minPrice: 100,
                    startingPrice: 2000,
                    priceDecrement: 50,
                    decrementInterval: 1000,
                    order: 5,
                    presentationTime: 30000
                },
                {
                    title: '"7"',
                    description: 'La alianza que gana este item puede robar a la otra alianza un item de subasta normal solamente, es de uso inmediato, si no se puede usar se traduce en 5 puntos',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 6,
                    presentationTime: 30000
                },
                {
                    title: 'Attention Pickpocket',
                    description: 'El equipo ganador le roba $500 de la subasta al otro equipo. El admin manejará manualmente las carteras de los equipos.',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 7,
                    presentationTime: 30000
                },
                {
                    title: 'Una Rusa',
                    description: 'El equipo ganador puede girar una ruleta donde puede ganar una copia de cualquier item normal de esta subasta (items de las rondas 1-7)',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 8,
                    hasMinigame: true,
                    minigameType: 'roulette',
                    presentationTime: 30000
                },
                {
                    title: 'Ludopatía',
                    description: 'El equipo ganador puede apostar entre 0 y 15 puntos de alianza para intentar duplicarlos en un juego de cara o sello',
                    type: 'normal',
                    minPrice: 100,
                    minIncrement: 50,
                    order: 9,
                    hasMinigame: true,
                    minigameType: 'coinflip',
                    presentationTime: 30000
                },
                {
                    title: 'Interferencia',
                    description: 'La alianza que gane este objeto puede hacer que la alianza rival en la siguiente ronda de juego deba comunicarse terminando sus frases en "Cambio", si no lo hace el host los ignorará, el host ha de ver como aplicarlo en la situación que se quiera aplicar',
                    type: 'special',
                    minPrice: 100,
                    startingPrice: 1500,
                    priceDecrement: 50,
                    decrementInterval: 1000,
                    order: 10,
                    presentationTime: 30000
                }
            ];

            for (const roundData of rounds) {
                await Round.create(roundData);
            }

            console.log(`✅ ${rounds.length} rondas creadas exitosamente:`);
            console.log('   - 8 rondas normales');
            console.log('   - 2 rondas especiales (rondas 5 y 10)');
            console.log('   - Tiempo de presentación: 30 segundos cada una');
            console.log('   - Tiempo de ronda: 3 minutos (configurable desde panel admin)');
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
