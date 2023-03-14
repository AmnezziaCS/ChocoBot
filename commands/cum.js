const { SlashCommandBuilder } = require("@discordjs/builders");

const emojiArray = ["😳", "🍆", "👌", "💦"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cum")
    .setDescription("N'utilisez pas cette commande pitié 😳.")
    .setDMPermission(false),
  aliases: ["um"],
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    if (unifiedInteraction.type === "interaction")
      return unifiedInteraction.message.reply(
        "Cette commande ne marche que en l'écrivant tel que `c!um` 😳."
      );
    emojiArray.forEach((emoji) => {
      unifiedInteraction.message.react(emoji);
    })
  },
};
