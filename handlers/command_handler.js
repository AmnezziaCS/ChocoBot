const fs = require("fs");

module.exports = (client) => {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if (command.data.name) {
      client.commands.set(command.data.name, command);
    } else {
      continue;
    }
  }
};
