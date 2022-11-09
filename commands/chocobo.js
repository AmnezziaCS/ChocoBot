const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chocobo")
    .setDescription("Me fait apparaître !")
    .setDMPermission(false),
  aliases: ["hocobo"],
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    return unifiedInteraction.message.reply(
      "https://tenor.com/view/alpha-ffxiv-chocobo-alphabestboi-gif-19909966"
    );
  },
};
