const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription(
      `Renvoie votre profil de monnaie ou celui de la personne que vous souhaitez.`
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription(
          "La mention de la personne dont vous souhaitez consulter la monnaie."
        )
    )
    .setDMPermission(false),
  aliases: ["bl", "bal", "b"],
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    profileData = await ProfileModel.findOne({
      userID: unifiedInteraction.user.id,
    });
    if (!profileData) {
      return;
    }

    // checks if someone is pinged in the message

    let target;

    if (unifiedInteraction.type === "message") {
      target = unifiedInteraction.message.mentions.users.first();
    } else {
      target = unifiedInteraction.options?.getUser("utilisateur") || null;
    }

    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;

    if (target == null) {
      const authorBalanceEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
        .setTitle(`Les thunasses de ${unifiedInteraction.user.username}`)
        .setFields({
          name: `Montant de ChocoCoins : `,
          value: `${profileData.chococoins} ©`,
        });
      return unifiedInteraction.message.reply({ embeds: [authorBalanceEmbed] });
    }

    // checks if pinged user is a bot

    if (target.bot) {
      const botTargetEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `Vous ne pouvez pas utiliser cette commande sur les bots !`,
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [botTargetEmbed] });
    }

    // checks if the pinged person has a money profile, if not, creates one

    targetProfileData = await ProfileModel.findOne({ userID: target.id });
    if (!targetProfileData) {
      let profile = await ProfileModel.create({
        userID: target.id,
        serverID: unifiedInteraction.guild.id,
        chococoins: 5000,
        dailyCheck: "2020-04-24T19:44:31.589+0000",
      });
      profile.save();

      const profileCreatedEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: `Le profil de la personne mentionnée a été créé`,
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        });
      return unifiedInteraction.message.reply({
        embeds: [profileCreatedEmbed],
      });
    }

    const targetBalanceEmbed = new MessageEmbed()
      .setColor("#F8F70E")
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`
      )
      .setTitle(`Les thunasses de ${target.username}`)
      .setFields({
        name: `Montant de ChocoCoins : `,
        value: `${targetProfileData.chococoins} ©`,
      });
    return unifiedInteraction.message.reply({ embeds: [targetBalanceEmbed] });
  },
};
