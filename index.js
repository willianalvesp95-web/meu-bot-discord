process.on("unhandledRejection", (error) => {
  console.error("UNHANDLED REJECTION:", error);
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});

const {
  Client,
  GatewayIntentBits,
  Events,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const produtos = require("./productos.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// BOT ONLINE
client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// INTERAÇÕES
client.on(Events.InteractionCreate, async (interaction) => {

  try {

    // SLASH COMMANDS
    if (interaction.isChatInputCommand()) {

      // TICKET PAINEL
      if (interaction.commandName === "ticket") {

        const embed = new EmbedBuilder()
          .setTitle("🎫 Central de Tickets")
          .setDescription("Clique no botão abaixo para abrir seu ticket.")
          .setColor(0x00AEFF);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("open_ticket")
            .setLabel("Abrir Ticket")
            .setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: false
        });
      }

      // LOJA
      if (interaction.commandName === "loja") {

        let lista = produtos.produtos
          .map(p => `🛒 **${p.nome}** - R$${p.preco}`)
          .join("\n");

        return interaction.reply({
          content: `📦 **LOJA:**\n\n${lista}`,
          ephemeral: false
        });
      }

      // COMPRAR (simples)
      if (interaction.commandName === "comprar") {

        const item = produtos.produtos[0];

        return interaction.reply(
          `💰 Você comprou **${item.nome}** por R$${item.preco}`
        );
      }
    }

    // BOTÕES
    if (interaction.isButton()) {

      if (!interaction.guild) return;

      // ABRIR TICKET
      if (interaction.customId === "open_ticket") {

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Fechar Ticket")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: `🎫 Ticket aberto por ${interaction.user}`,
          components: [closeRow]
        });

        return interaction.reply({
          content: `✅ Ticket criado: ${channel}`,
          ephemeral: true
        });
      }

      // FECHAR TICKET
      if (interaction.customId === "close_ticket") {

        await interaction.reply("🔒 Fechando ticket...");

        setTimeout(() => {
          if (interaction.channel) interaction.channel.delete();
        }, 2000);
      }
    }

  } catch (err) {
    console.error("ERRO:", err);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Ocorreu um erro no sistema.",
        ephemeral: true
      }).catch(() => {});
    }
  }

});

// LOGIN
client.login(process.env.DISCORD_TOKEN);
