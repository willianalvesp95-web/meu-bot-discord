const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const handleTicket        = require("./commands/ticket");
const handleComprar       = require("./commands/comprar");
const handlePainel        = require("./commands/painel");
const handleLogs          = require("./commands/logs");
const handleAddProduct    = require("./commands/addproduct");
const handleRemoveProduct = require("./commands/removeproduct");
const handleButton        = require("./handlers/buttonHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("clientReady", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      if (commandName === "ticket")        return handleTicket(interaction);
      if (commandName === "comprar")       return handleComprar(interaction);
      if (commandName === "painel")        return handlePainel(interaction);
      if (commandName === "logs")          return handleLogs(interaction);
      if (commandName === "addproduct")    return handleAddProduct(interaction);
      if (commandName === "removeproduct") return handleRemoveProduct(interaction);
    }

    if (interaction.isButton()) {
      return handleButton(interaction);
    }
  } catch (err) {
    console.error("Erro ao processar interação:", err);
    const msg = { content: "❌ Ocorreu um erro. Tente novamente.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
