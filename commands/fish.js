const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");
const getRandomInt = require("../utils/getRandomInt");

const helpEmbed = (unifiedInteraction) => {
  const helpEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`
    )
    .setTitle(`Fish`)
    .setDescription(
      "La commande fish vous permet de pêcher pour essayer de gagner des chococoins, il vous suffit de réagir à l'émoji qui correspond à la colonne du poisson !"
    )
    .setFields({
      name: "`c!fish / f [help]`",
      value: "L'ajout de help après la commande vous donnera cet embed !",
    });
  return unifiedInteraction.message.reply({ embeds: [helpEmbed] });
};

const fishWinEmbed = (unifiedInteraction, fishValue, profileData) => {
  const fishWinEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`
    )
    .setTitle(`Vous avez réussi à pêcher le poisson !`)
    .setFields({
      name: `Votre compte a été crédité de ${fishValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `,
      value: `${profileData.chococoins + parseInt(fishValue)} ©`,
    });
  return unifiedInteraction.message.channel.send({
    embeds: [fishWinEmbed],
  });
};

const fishLossEmbed = (unifiedInteraction) => {
  const fishLossEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`
    )
    .setTitle(
      `Vous n'avez pas réussi à pêcher le poisson par conséquent, vous n'avez rien gagné !`
    );
  return unifiedInteraction.message.channel.send({
    embeds: [fishLossEmbed],
  });
};

const fishingEndsEmbed = (unifiedInteraction) => {
  const countingStartsEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`
    )
    .setTitle(`L'événement de pêche s'est terminé par manque de temps !`);
  return unifiedInteraction.message.channel.send({
    embeds: [countingStartsEmbed],
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fish")
    .setDescription("Permet de pêcher pour espérer gagner des chococoins.")
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Option en plus pour la commande.")
        .addChoices({ name: "Voir plus d'infos", value: "help" })
    )
    .setDMPermission(false),
  aliases: ["f"],
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    switch (unifiedInteraction.type) {
      case "message":
        if (unifiedInteraction?.options[0] === "help") {
          return helpEmbed(unifiedInteraction);
        }
        break;

      case "interaction":
        if (unifiedInteraction.options?.getString("option") === "help") {
          return helpEmbed(unifiedInteraction);
        }
        break;
    }

    // checks if message author has a coins profile

    profileData = await ProfileModel.findOne({
      userID: unifiedInteraction.user.id,
    });
    if (!profileData) {
      return;
    }

    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;
    const emojiList = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
    let notTime = true;

    let fishMessage = "";
    let fishIndex;
    do {
      fishIndex = getRandomInt(30) + 1;
    } while (fishIndex % 6 === 0);

    for (i = 1; i < 31; i++) {
      if (i % 6 === 0) {
        fishMessage += "\n";
        continue;
      }
      fishMessage += i === fishIndex ? "🐟" : "🌊";
    }

    let collectedEmbed = await unifiedInteraction.message.reply({
      content: fishMessage,
      fetchReply: true,
    });

    for (const emoji of emojiList) await collectedEmbed.react(emoji);
    const filter = (reaction, user) =>
      emojiList.includes(reaction.emoji.name) && !user.bot;
    const reactionCollector = collectedEmbed.createReactionCollector({
      filter,
      time: 60000,
    });

    reactionCollector.on("collect", async (reaction, user) => {
      if (user.id != unifiedInteraction.user.id)
        return reaction.users.remove(user);

      correctAnswer = fishIndex % 6;
      if (reaction.emoji.name.includes(correctAnswer)) {
        const fishValue = getRandomInt(51);
        const balanceUpdate = await ProfileModel.findOneAndUpdate(
          {
            userID: unifiedInteraction.user.id,
          },
          {
            $inc: {
              chococoins: fishValue,
            },
          }
        );

        notTime = false;
        fishWinEmbed(unifiedInteraction, fishValue, profileData);
        await collectedEmbed.reactions.removeAll();
        return reactionCollector.stop();
      } else {
        notTime = false;
        fishLossEmbed(unifiedInteraction);
        await collectedEmbed.reactions.removeAll();
        return reactionCollector.stop();
      }
    });
    reactionCollector.on("end", () => {
      collectedEmbed.delete();
      if (notTime) return fishingEndsEmbed(unifiedInteraction);
    });
  },
};
