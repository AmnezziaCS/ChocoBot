const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meilleurmove")
    .setDescription("La vidéo du meilleur move !")
    .setDMPermission(false),
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    unifiedInteraction.message.reply({
      files: [
        {
          attachment: "./media/videos/meilleurmove.mp4",
          name: "meilleurmove.mp4",
        },
      ],
    });
  },
};
