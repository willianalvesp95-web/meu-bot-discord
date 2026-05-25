const fs = require("fs");

const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔥 SEU ID JÁ COLOCADO
const ADMIN_ID = "1408931267747123303";

// carregar produtos
let produtos = require("./products.json");

// salvar produtos no JSON
function salvarProdutos() {
  fs.writeFileSync("./products.json", JSON.stringify(produtos, null, 2));
}

client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// ======================
// INTERAÇÕES
// ======================
client.on(Events.InteractionCreate, async (interaction) => {

  try {

    // ======================
    // /PAINEL (ADMIN)
// ======================
    if (interaction.isChatInputCommand()) {

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
            .setCustomId("add_teste")
            .setLabel("Adicionar teste")
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId("add_teste2")
            .setLabel("Adicionar teste2")
            .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true
        });
      }

      // ======================
      // /LOJA
      // ======================
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

      // proteção admin
      if (interaction.user.id !== ADMIN_ID) {
        return interaction.reply({
          content: "❌ Sem permissão.",
          ephemeral: true
        });
      }

      // VIP
      if (interaction.customId === "add_teste") {

        produtos.produtos.push({
          id: "teste",
          nome: "teste",
          preco: 1
        });

        salvarProdutos();

        return interaction.reply({
          content: "✅ teste adicionado na loja!",
          ephemeral: true
        });
      }

      // COINS
      if (interaction.customId === "add_coin") {

        produtos.produtos.push({
          id: "teste2",
          nome: "teste2",
          preco: 1
        });

        salvarProdutos();

        return interaction.reply({
          content: "✅ teste2 adicionados na loja!",
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

client.login(process.env.DISCORD_TOKEN);
