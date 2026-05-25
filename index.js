const { 
  Client, 
  GatewayIntentBits, 
  Events 
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// BOT LIGANDO
client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// COMANDOS
client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.isChatInputCommand()) return;

  try {

    if (interaction.commandName === "ticket") {
      return await interaction.reply("🎫 Ticket criado!");
    }

    if (interaction.commandName === "comprar") {
      return await interaction.reply("💰 Loja aberta!");
    }

  } catch (err) {
    console.error(err);

    if (interaction.replied || interaction.deferred) return;

    await interaction.reply({
      content: "❌ Erro ao executar o comando.",
      ephemeral: true
    });
  }

});

client.login(process.env.DISCORD_TOKEN);
