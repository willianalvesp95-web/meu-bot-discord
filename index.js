const fs = require("fs");

const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Seu ID
const ADMIN_ID = "1408931267747123303";

// Carregar produtos
let produtos = require("./products.json");

// Salvar produtos
function salvarProdutos() {
  fs.writeFileSync(
    "./products.json",
    JSON.stringify(produtos, null, 2)
  );
}

client.once("ready", () => {
  console.log(`🤖 Bot ligado: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {

  try {

    // COMANDOS
    if (interaction.isChatInputCommand()) {

      // /painel
      if (interaction.commandName === "painel") {

        if (interaction.user.id !== ADMIN_ID) {
          return interaction.reply({
            content: "❌ Sem permissão.",
            ephemeral: true
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("🛠 Painel Admin")
          .setDescription("Clique abaixo para criar produto")
          .setColor(0x00AEFF);

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("criar_produto")
              .setLabel("➕ Criar Produto")
              .setStyle(ButtonStyle.Success)
          );

        return interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true
        });
      }

      // /loja
      if (interaction.commandName === "loja") {

        if (produtos.produtos.length === 0) {
          return interaction.reply({
            content: "❌ Nenhum produto criado."
          });
        }

        let lista = produtos.produtos
          .map(p => `📦 ${p.nome}\n💰 R$${p.preco}`)
          .join("\n\n");

        const rows = produtos.produtos.map(p => {

          return new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`comprar_${p.id}`)
                .setLabel(`Comprar ${p.nome}`)
                .setEmoji("🛒")
                .setStyle(ButtonStyle.Success)
            );

        });

        return interaction.reply({
          content: `📦 **LOJA**\n\n${lista}`,
          components: rows
        });
      }

    }

    // BOTÕES
    if (interaction.isButton()) {

      // Criar produto
      if (interaction.customId === "criar_produto") {

        if (interaction.user.id !== ADMIN_ID) {
          return interaction.reply({
            content: "❌ Sem permissão.",
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("produto_modal")
          .setTitle("Criar Produto");

        const nome = new TextInputBuilder()
          .setCustomId("nome")
          .setLabel("Nome do produto")
          .setStyle(TextInputStyle.Short);

        const preco = new TextInputBuilder()
          .setCustomId("preco")
          .setLabel("Preço")
          .setStyle(TextInputStyle.Short);

        modal.addComponents(
          new ActionRowBuilder().addComponents(nome),
          new ActionRowBuilder().addComponents(preco)
        );

        return interaction.showModal(modal);
      }

      // Comprar produto
      if (interaction.customId.startsWith("comprar_")) {

        const id = interaction.customId.replace(
          "comprar_",
          ""
        );

        const produto = produtos.produtos.find(
          p => p.id === id
        );

        if (!produto) {
          return interaction.reply({
            content: "❌ Produto não encontrado.",
            ephemeral: true
          });
        }

        return interaction.reply({
          content:
`🛒 Compra iniciada

📦 Produto: ${produto.nome}
💰 Preço: R$${produto.preco}`,
          ephemeral: true
        });
      }

    }

    // FORMULÁRIO
    if (interaction.isModalSubmit()) {

      if (interaction.customId === "produto_modal") {

        const nome =
          interaction.fields.getTextInputValue("nome");

        const preco =
          interaction.fields.getTextInputValue("preco");

        produtos.produtos.push({
          id: Date.now().toString(),
          nome,
          preco
        });

        salvarProdutos();

        return interaction.reply({
          content:
`✅ Produto criado!

📦 ${nome}
💰 R$${preco}`,
          ephemeral: true
        });
      }

    }

  } catch (err) {
    console.error(err);
  }

});

client.login(process.env.DISCORD_TOKEN);
