const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Abrir painel de ticket"),

  new SlashCommandBuilder()
    .setName("comprar")
    .setDescription("Abrir loja")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registrando comandos...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("Comandos registrados com sucesso!");
  } catch (err) {
    console.error(err);
  }
})();
