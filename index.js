const { 
  Client, 
  GatewayIntentBits, 
  Events 
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// COMANDOS
client.on(Events.InteractionCreate, async (interaction) => {

  // /ticket
  if (interaction.isChatInputCommand() && interaction.commandName === "ticket") {
    return interaction.reply("🎫 Ticket criado!");
  }

  // /comprar
  if (interaction.isChatInputCommand() && interaction.commandName === "comprar") {
    return interaction.reply("💰 Compra iniciada!");
  }

  // BOTÕES
  if (interaction.isButton()) {

    if (interaction.customId === "painel_ticket") {
      return interaction.reply({
        content: "🎫 Ticket aberto!",
        ephemeral: true
      });
    }

  }

});

client.login(process.env.DISCORD_TOKEN);
