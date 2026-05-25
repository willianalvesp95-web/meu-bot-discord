const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {

  if (interaction.isChatInputCommand() && interaction.commandName === "ticket") {
    return interaction.reply("🎫 Ticket criado!");
  }

  if (interaction.isChatInputCommand() && interaction.commandName === "comprar") {
    return interaction.reply("💰 Loja aberta!");
  }

});

client.login(process.env.DISCORD_TOKEN);
