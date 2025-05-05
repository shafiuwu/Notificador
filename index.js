const { Client, GatewayIntentBits } = require('discord.js');
const tioanime = require('tioanime');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let ultimoAnime = null;

async function verificarNuevoAnime() {
  try {
    const animes = await tioanime.latestAnime();
    const animeNuevo = animes[0];

    if (!ultimoAnime) {
      ultimoAnime = animeNuevo;
      console.log('🔄 Verificando nuevos animes...');
      return;
    }

    if (animeNuevo.url !== ultimoAnime.url) {
      ultimoAnime = animeNuevo;

      const canal = client.channels.cache.get('991133354260959244');
      if (canal) {
        canal.send(`📢 **¡Nuevo anime disponible!**\n**${animeNuevo.title}**\n🔗 ${animeNuevo.url}`);
      }
    }
  } catch (err) {
    console.error('Error al verificar nuevos animes:', err);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);

  setInterval(verificarNuevoAnime, 60 * 1000);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // ✅ Evita que responda a otros bots
    if (message.content.toLowerCase() === 'hola') {
        message.reply('burunyuu~ ✨');
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    if (message.content === '!ultimos') {
      try {
        const animes = await tioanime.latestEpisodesAdded();
        const top5 = animes.slice(0, 5); // Solo los 5 primeros
  
        let respuesta = '**🆕 Últimos animes añadidos:**\n\n';
        top5.forEach((anime, i) => {
          respuesta += `${i + 1}. [${anime.title}] capitulo (${anime.episode})\n`;
        });
  
        message.channel.send(respuesta);
      } catch (error) {
        console.error(error);
        message.channel.send('❌ Hubo un error al obtener los animes.');
      }
    }
  });

client.login(process.env.DISCORDTOKEN);
