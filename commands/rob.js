const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");
const getRandomInt = require("../utils/getRandomInt");

const updateAuthorChocoCoins = async (value, unifiedInteraction) => {
  const balanceUpdate = await ProfileModel.findOneAndUpdate(
    {
      userID: unifiedInteraction.user.id,
    },
    {
      $inc: {
        chococoins: value,
      },
    }
  );
};

const updateTargetChocoCoins = async (value, targetProfileData, target) => {
  targetProfileData = await ProfileModel.findOneAndUpdate(
    {
      userID: target.id,
    },
    {
      $inc: {
        chococoins: value,
      },
    }
  );
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription(
      "Cette commande vous permet de voler de l'argent à quelqu'un !"
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("La mention de la personne que vous souhaitez voler.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;

    // checks if the message author has a coin profile

    profileData = await ProfileModel.findOne({
      userID: unifiedInteraction.user.id,
    });
    if (!profileData) {
      return;
    }

    let target;

    if (unifiedInteraction.type === "message") {
      target = unifiedInteraction.message.mentions.users.first();
    } else {
      target = unifiedInteraction.options.getUser("utilisateur");
    }

    if (!target) {
      const errorEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setTitle(`Rob`)
        .setDescription(
          "La commande rob vous permet de voler des ChocoCoins à la personne mentionnée. Ceci dit, gare à ne pas vous faire prendre ou vous le regretterez !"
        )
        .setFields({
          name: "`c!rob [mention de la personne à voler]`",
          value:
            "Attention, vous devez avoir un solde de ChocoCoins au moins supérieur à 1000 pour pouvoir rob un utilisateur !",
        });
      return unifiedInteraction.message.reply({ embeds: [errorEmbed] });
    }

    if (target === unifiedInteraction.user) {
      const selfRobEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `Vous ne pouvez pas vous rob vous même !`,
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [selfRobEmbed] });
    }

    if (target.bot) {
      const botTargetEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `Vous ne pouvez pas utiliser cette commande sur les bots !`,
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [botTargetEmbed] });
    }

    // checks if the pinged person has a coin profile, if not, creates one

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

    if (profileData.chococoins < 1000 || targetProfileData.chococoins < 1000) {
      const notEnoughMoneyEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: `Vous ou la personne que vous avez essayé de rob possède moins de 1000 ChocoCoins, par conséquent, vous ne pouvez utiliser cette commande !`,
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        });
      return unifiedInteraction.message.reply({
        embeds: [notEnoughMoneyEmbed],
      });
    }

    const small = 100;
    const big = 500;
    switch (getRandomInt(5)) {
      case 0:
      case 1:
        updateAuthorChocoCoins(-small, unifiedInteraction);
        updateTargetChocoCoins(small, targetProfileData, target);
        const smallLossEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(
            `En essayant de voler ${target.username}, vous vous êtes pris un mur et avez perdu ${small} © !`
          )
          .setFields({
            name: `Votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins - small} ©`,
          });
        return unifiedInteraction.message.reply({ embeds: [smallLossEmbed] });
      case 2:
        updateAuthorChocoCoins(-big, unifiedInteraction);
        updateTargetChocoCoins(big, targetProfileData, target);
        const bigLossEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(
            `En essayant de voler ${target.username}, vous vous êtes fait arrêter et avez du lui donner ${big} © !`
          )
          .setFields({
            name: `Votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins - big} ©`,
          });
        return unifiedInteraction.message.reply({ embeds: [bigLossEmbed] });
      case 3:
        updateAuthorChocoCoins(small, unifiedInteraction);
        updateTargetChocoCoins(-small, targetProfileData, target);
        const smallGainEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(
            `Vous avez réussi à voler ${target.username}, vous lui avez fait les poches et récupérez ${small} © !`
          )
          .setFields({
            name: `Votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins + small} ©`,
          });
        return unifiedInteraction.message.reply({ embeds: [smallGainEmbed] });
      case 4:
        updateAuthorChocoCoins(big, unifiedInteraction);
        updateTargetChocoCoins(-big, targetProfileData, target);
        const bigGainEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(
            `Vous avez réussi à voler ${target.username}, vous repartez avec sa carte de crédit qui contenait ${big} © !`
          )
          .setFields({
            name: `Votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins + big} ©`,
          });
        return unifiedInteraction.message.reply({ embeds: [bigGainEmbed] });
    }
  },
};
