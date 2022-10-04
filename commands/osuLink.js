const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");
const getUser = require("../osuApi/getUser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("osulink")
    .setDescription("Permet de lier votre profil osu à votre discord.")
    .addStringOption((option) =>
      option.setName("id").setDescription("L'id du profil osu à lier.")
    )
    .setDMPermission(false),
  aliases: ["olink", "ol"],
  async execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    let osuID;

    if (unifiedInteraction.type === "message") {
      osuID = unifiedInteraction.options[0];
    } else {
      osuID = unifiedInteraction.options.getString("id");
    }

    // Checks if command is valid

    if (!parseInt(osuID)) {
      const osuLinkExplanationsEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setTitle(`OsuLink`)
        .setDescription(
          "La commande osuLink vous permet de lier votre comtpe discord à votre ID de joueur osu trouvable sur votre profil."
        )
        .setFields({
          name: "`c!osuLink [ID de joueur osu]`",
          value: "Un ID incorrect ne sera pas pris en compte !",
        });
      return unifiedInteraction.message.reply({
        embeds: [osuLinkExplanationsEmbed],
      });
    }

    const user = await getUser(osuID);

    // Checks if user exists

    if (user === null) {
      const wrongIDEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `Votre ID ${osuID} n'est pas valable, merci de choisir un ID correct !`,
        iconURL: `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [wrongIDEmbed] });
    }

    // Creates embed

    const osuLinkUpdate = await ProfileModel.findOneAndUpdate(
      {
        userID: unifiedInteraction.user.id,
      },
      {
        $set: {
          osuUserID: osuID,
        },
      }
    );
    const osuLinkFinalEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
      name: `Le compte osu ${user.username} a bien été lié à votre Discord !`,
      iconURL: `${user.avatar_url}.jpeg`,
    });
    return unifiedInteraction.message.reply({ embeds: [osuLinkFinalEmbed] });
  },
};
