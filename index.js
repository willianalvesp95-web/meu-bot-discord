const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// comandos
const commands = [
  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Abrir ticket"),

  new SlashCommandBuilder()
    .setName("comprar")
    .setDescription("Ver loja")
].map(cmd => cmd.toJSON());

// registrar comandos
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  console.log(`Bot ligado: ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("Comandos registrados!");
  } catch (err) {
    console.error(err);
  }
});

// interações
client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ticket") {
    return interaction.reply("🎫 Ticket criado!");
  }

  if (interaction.commandName === "comprar") {
    return interaction.reply("💰 Loja aberta!");
  }

});

client.login(process.env.DISCORD_TOKEN);
