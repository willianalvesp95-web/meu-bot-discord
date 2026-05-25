const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// CLIENTE
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// COMANDOS SLASH
const commands = [
  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Abrir ticket"),

  new SlashCommandBuilder()
    .setName("comprar")
    .setDescription("Ver loja")
].map(cmd => cmd.toJSON());

// REST (registrar comandos)
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// READY
client.once("ready", async () => {
  console.log(`Bot ligado: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("Slash commands registrados!");
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }
});

// INTERAÇÕES
client.on(Events.InteractionCreate, async (interaction) => {

  // /ticket
  if (interaction.isChatInputCommand() && interaction.commandName === "ticket") {
    return interaction.reply("🎫 Ticket criado!");
  }

  // /comprar
  if (interaction.isChatInputCommand() && interaction.commandName === "comprar") {
    return interaction.reply("💰 Loja aberta!");
  }

  // BOTÃO
  if (interaction.isButton()) {
    if (interaction.customId === "painel_ticket") {
      return interaction.reply({
        content: "🎫 Ticket aberto!",
        ephemeral: true
      });
    }
  }

});

// LOGIN
client.login(process.env.DISCORD_TOKEN);
