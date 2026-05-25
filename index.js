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

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot ligado: ${client.user.tag}`);
});

// INTERAÇÕES
client.on(Events.InteractionCreate, async (interaction) => {

  // /ticket → painel
  if (interaction.isChatInputCommand()) {

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

    if (interaction.commandName === "comprar") {
      return interaction.reply("💰 Loja aberta!");
    }
  }

  // BOTÕES
  if (interaction.isButton()) {

    // abrir ticket
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

    // fechar ticket
    if (interaction.customId === "close_ticket") {

      await interaction.reply("🔒 Fechando ticket...");

      setTimeout(() => {
        interaction.channel.delete();
      }, 2000);
    }
  }

});

if (!process.env.DISCORD_TOKEN) {
  console.error("TOKEN NÃO DEFINIDO");
} else {
  client.login(process.env.DISCORD_TOKEN);
}
