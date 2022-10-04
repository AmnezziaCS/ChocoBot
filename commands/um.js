const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("um")
    .setDescription("N'utilisez pas cette commande pitié 😳.")
    .setDMPermission(false),
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    if (unifiedInteraction.type === "interaction")
      return unifiedInteraction.message.reply(
        "Cette commande ne marche que en l'écrivant tel que `c!um` 😳."
      );
    unifiedInteraction.message.react(`😳`);
    unifiedInteraction.message.react(`🍆`);
    unifiedInteraction.message.react(`👌`);
    unifiedInteraction.message.react(`💦`);
  },
};
