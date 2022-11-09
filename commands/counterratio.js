const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counterratio")
    .setDescription("Permet de soutenir quelqu'un dans son contre ratio !")
    .setDMPermission(false),
  aliases: ["ounterratio"],
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    return unifiedInteraction.message
      .reply({
        content: `Je soutiens ${unifiedInteraction.user.username} dans son contre ratio <:Madge:836688670316691486>`,
        fetchReply: true,
      })
      .then((sentEmbed) => {
        sentEmbed.react("<:Upvote:724968272218423296>");
      });
  },
};
