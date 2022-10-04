const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = async (client) => {
  let commands = [];

  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if (command.data.name) {
      commands.push(command.data.toJSON());
    } else {
      continue;
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID), {
    body: commands,
  });
  console.log("Les commandes slash sont crées avec succés !");
};
