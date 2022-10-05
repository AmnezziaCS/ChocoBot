const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription(
      `Cette commande permet de miser une somme d'argent pour soit la doubler soit la perdre !`
    )
    .addIntegerOption((option) =>
      option
        .setName("chococoins")
        .setDescription("La somme d'argent à miser.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;

    // checks if the message author has a money profile, if not creates one.

    profileData = await ProfileModel.findOne({
      userID: unifiedInteraction.user.id,
    });
    if (!profileData) {
      return;
    }

    // checks if the command is right c!bet [coins value]

    let betValueOG;

    if (unifiedInteraction.type === "message") {
      [betValueOG] = unifiedInteraction.options;

      if (!parseInt(betValueOG)) {
        const betExplanationsEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setTitle(`Bet`)
          .setDescription(
            "La commande bet vous permet de miser une somme d'argent pour espérer en récupérer le double. ceci dit, faites attention à ne pas perdre votre mise !"
          )
          .setFields({
            name: "`c!bet [valeur en ChocoCoins]`",
            value:
              "Si votre solde de ChocoCoins est insuffisant par rapport à votre mise, vous ne pourrez effectuer la commande !",
          });
        return unifiedInteraction.message.reply({
          embeds: [betExplanationsEmbed],
        });
      }
    }

    const betValue = betValueOG
      ? parseInt(betValueOG)
      : unifiedInteraction.options.getInteger("chococoins");

    // checks if the message author has more than 0 coins

    if (profileData.chococoins <= 0) {
      const zeroCoinsEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: "Votre solde de ChocoCoins est insuffisant, vous avez 0 ©",
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [zeroCoinsEmbed] });
    }

    // checks if the value of the bet is superior/equal to 0

    if (betValue <= 0) {
      const negativeBetEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: "Vous avez voulu bet une valeur négative de chococoins !",
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        })
        .setDescription(
          `Veuillez donner une valeur positive si vous souhaitez bet !`
        );
      return unifiedInteraction.message.reply({ embeds: [negativeBetEmbed] });
    }

    // checks if message author has more or same ammount of coins than what he bet

    if (profileData.chococoins < betValue) {
      const notEnoughCoinsEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: "Votre solde de ChocoCoins est insuffisant",
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        })
        .setFields({
          name: `Votre avez bet ${betValue} ChocoCoins alors que vous n'en possédez que: `,
          value: `${profileData.chococoins} ©`,
        });
      return unifiedInteraction.message.reply({
        embeds: [notEnoughCoinsEmbed],
      });
    }

    // message author either wins or loses coins according to a random value

    switch (getRandomInt(2)) {
      case 0:
        balanceUpdate = await ProfileModel.findOneAndUpdate(
          {
            userID: unifiedInteraction.user.id,
          },
          {
            $inc: {
              chococoins: betValue,
            },
          }
        );
        const accountIncreasedByBetEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(`Bravo, vous avez gagné !`)
          .setFields({
            name: `Votre compte à été crédité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins + parseInt(betValue)} ©`,
          });
        return unifiedInteraction.message.reply({
          embeds: [accountIncreasedByBetEmbed],
        });
      case 1:
        balanceUpdate = await ProfileModel.findOneAndUpdate(
          {
            userID: unifiedInteraction.user.id,
          },
          {
            $inc: {
              chococoins: -betValue,
            },
          }
        );
        const accountDecreasedByBetEmbed = new MessageEmbed()
          .setColor("#F8F70E")
          .setThumbnail(`https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`)
          .setTitle(`Nonnn, vous avez perdu !`)
          .setFields({
            name: `Votre compte à été débité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `,
            value: `${profileData.chococoins - parseInt(betValue)} ©`,
          });
        return unifiedInteraction.message.reply({
          embeds: [accountDecreasedByBetEmbed],
        });
    }
  },
};
