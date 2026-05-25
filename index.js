process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

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

client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// =========================
// INTERAÇÕES
// =========================
client.on(Events.InteractionCreate, async (interaction) => {

  try {

    // =========================
    // COMANDO /LOJA (PAINEL)
    // =========================
    if (interaction.isChatInputCommand()) {

      if (interaction.commandName === "loja") {

        const embed = new EmbedBuilder()
          .setTitle("🛒 Loja teste")
          .setDescription("Escolha um produto abaixo:")
          .setColor(0x00AEFF);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("teste")
            .setLabel("VIP - R$1")
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId("teste2")
            .setLabel(" - R$1")
            .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row]
        });
      }
    }

    // =========================
    // BOTÕES
    // =========================
    if (interaction.isButton()) {

      // VIP
      if (interaction.customId === "buy_teste") {

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("teste")
            .setLabel("Já paguei")
            .setStyle(ButtonStyle.Success)
        );

        return interaction.reply({
          content:
`💰 PIX COPIA E COLA (VIP)

00020126580014BR.GOV.BCB.PIX-SEUPIXAQUI

💡 Valor: R$1

Após pagar, clique abaixo:`,
          components: [row],
          ephemeral: true
        });
      }

      // COINS
      if (interaction.customId === "buy_teste2") {

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("teste2")
            .setLabel("Já paguei")
            .setStyle(ButtonStyle.Success)
        );

        return interaction.reply({
          content:
`💰 PIX COPIA E COLA (teste2)

00020126580014BR.GOV.BCB.PIX-SEUPIXAQUI

💡 Valor: R$1

Após pagar, clique abaixo:`,
          components: [row],
          ephemeral: true
        });
      }

      // =========================
      // JÁ PAGUEI teste
      // =========================
      if (interaction.customId === "paid_teste") {
        return interaction.reply({
          content: "⏳ Pagamento teste2 enviado! Aguarde a liberação manual.",
          ephemeral: true
        });
      }

      // =========================
      // JÁ PAGUEI teste2
      // =========================
      if (interaction.customId === "teste2") {
        return interaction.reply({
          content: "⏳ Pagamento de teste2 enviado! Aguarde a liberação manual.",
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.error("ERRO:", err);

    if (!interaction.replied) {
      interaction.reply({
        content: "❌ Erro no sistema.",
        ephemeral: true
      }).catch(() => {});
    }
  }

});

// LOGIN
client.login(process.env.DISCORD_TOKEN);
