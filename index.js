const fs = require("fs");

const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// ======================
// CONFIG
// ======================
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// 🔥 SEU ID (admin)
const ADMIN_ID = "1408931267747123303";

// ======================
// PRODUTOS
// ======================
let produtos = require("./products.json");

function salvarProdutos() {
  fs.writeFileSync("./products.json", JSON.stringify(produtos, null, 2));
}

// ======================
// REGISTRAR COMANDOS (AUTO)
// ======================
const commands = [
  new SlashCommandBuilder()
    .setName("painel")
    .setDescription("Painel admin"),

  new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Ver loja")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Comandos registrados!");
  } catch (err) {
    console.error(err);
  }
})();

// ======================
// BOT LIGOU
// ======================
client.once("ready", () => {
  console.log(`🤖 Bot ligado: ${client.user.tag}`);
});

// ======================
// INTERAÇÕES
// ======================
client.on(Events.InteractionCreate, async (interaction) => {

  try {

    // ======================
    // SLASH COMMANDS
    // ======================
    if (interaction.isChatInputCommand()) {

      // 🛠 PAINEL ADMIN
      if (interaction.commandName === "painel") {

        if (interaction.user.id !== ADMIN_ID) {
          return interaction.reply({
            content: "❌ Sem permissão.",
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("🛠 Painel da Loja")
          .setDescription("Adicionar produtos na loja")
          .setColor(0xff0000);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("add_vip")
            .setLabel("Adicionar VIP")
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId("add_coin")
            .setLabel("Adicionar Coins")
            .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true
        });
      }

      // 🛒 LOJA
      if (interaction.commandName === "loja") {

        let lista = produtos.produtos
          .map(p => `🛒 **${p.nome}** - R$${p.preco}`)
          .join("\n");

        if (!lista) lista = "Nenhum produto na loja.";

        return interaction.reply({
          content: `📦 **LOJA:**\n\n${lista}`
        });
      }
    }

    // ======================
    // BOTÕES
    // ======================
    if (interaction.isButton()) {

      if (interaction.user.id !== ADMIN_ID) {
        return interaction.reply({
          content: "❌ Sem permissão.",
          ephemeral: true
        });
      }

      // VIP
      if (interaction.customId === "add_vip") {

        produtos.produtos.push({
          id: "vip",
          nome: "VIP Premium",
          preco: 10
        });

        salvarProdutos();

        return interaction.reply({
          content: "✅ VIP adicionado!",
          ephemeral: true
        });
      }

      // COINS
      if (interaction.customId === "add_coin") {

        produtos.produtos.push({
          id: "coin",
          nome: "1000 Coins",
          preco: 5
        });

        salvarProdutos();

        return interaction.reply({
          content: "✅ Coins adicionados!",
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.error(err);

    if (!interaction.replied) {
      interaction.reply({
        content: "❌ Erro no sistema.",
        ephemeral: true
      });
    }
  }

});

// ======================
// LOGIN
// ======================
client.login(TOKEN);
