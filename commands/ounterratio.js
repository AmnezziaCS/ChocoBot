const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ounterratio")
    .setDescription("Permet de soutenir qqun dans son contre ratio !")
    .setDMPermission(false),
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
