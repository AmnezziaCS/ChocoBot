const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");

const errorEmbed = (unifiedInteraction) => {
  const errorEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setTitle(`Give`)
    .setDescription(
      "La commande give vous permet de donner ou retirer des chcococoins à un user !"
    )
    .setFields({
      name: "`c!give [valeur en ChocoCoins] [tag de l'utilisateur ciblé]`",
      value: "En cas de problèmes, la commande ne s'éxecutera pas !",
    });
  return unifiedInteraction.message.reply({ embeds: [errorEmbed] });
};

const editedFinalEmbed = (unifiedInteraction) => {
  const editedFinalEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
    name: `Vous n'avez rien choisi !`,
    iconURL: `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`,
  });
  return editedFinalEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription(
      "Permet de give des chococoins, cette commande est résérvée à l'admin du bot Amnezzia#3632"
    )
    .addIntegerOption((option) =>
      option
        .setName("montant")
        .setDescription(
          "Le montant en coins que vous souhaitez donner ou retirer."
        )
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à qui vous souhaitez donner ou retirer.")
    )
    .setDMPermission(false),
  async execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;
    const stonksEmoji = "📈";
    const notStoksEmoji = "📉";
    const emojiList = [stonksEmoji, notStoksEmoji];
    let embedEdited = false;
    let moneyAmount;
    let target;

    if (unifiedInteraction.type === "message") {
      [moneyAmount] = unifiedInteraction.options;
    } else {
      moneyAmount = unifiedInteraction.options.getInteger("montant");
    }

    // checks if message author is bot admin

    if (unifiedInteraction.user.id != process.env.BOT_OWNER_ID) {
      const permissionsWrongEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: `Vous ne pouvez pas utiliser cette commande`,
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        });
      return unifiedInteraction.message.reply({
        embeds: [permissionsWrongEmbed],
      });
    }

    // checks if command provided amount value is correct and if someone was pinged

    if (unifiedInteraction.type === "message") {
      target = unifiedInteraction.message.mentions.users.first();
    } else {
      target = unifiedInteraction.options.getUser("utilisateur");
    }

    if (!parseInt(moneyAmount) || !target) {
      return errorEmbed(unifiedInteraction);
    }

    // checks if pinged person's a bot

    if (target.bot) {
      const botTargetEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `Vous ne pouvez pas utiliser cette commande sur les bots !`,
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      });
      return unifiedInteraction.message.reply({ embeds: [botTargetEmbed] });
    }

    // checks if pinged person has a money profile, if not creates one

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

    // creation of our eventListener / reaction collector

    const chooseAddOrRemoveEmbed = new MessageEmbed()
      .setColor("#F8F70E")
      .setAuthor({
        name: `Choisissez si vous voulez lui ajouter ou lui retirer cette somme !`,
        iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
      })
      .setDescription(
        `${stonksEmoji} = Add ${moneyAmount} ChocoCoins to ${target}'s account ? \n\n${notStoksEmoji} = Remove ${moneyAmount} ChocoCoins from ${target}'s account ?`
      );
    let collectedEmbed = await unifiedInteraction.message.reply({
      embeds: [chooseAddOrRemoveEmbed],
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

      reaction.users.remove(unifiedInteraction.user);

      // we either choose to increase or decrease the amount of coins

      switch (reaction.emoji.name) {
        case emojiList[0]:
          await collectedEmbed.reactions.removeAll();
          balanceUpdate = await ProfileModel.findOneAndUpdate(
            {
              userID: target.id,
            },
            {
              $inc: {
                chococoins: moneyAmount,
              },
            }
          );
          const coinsIncreasedEmbed = new MessageEmbed()
            .setColor("#F8F70E")
            .setThumbnail(
              `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`
            )
            .setTitle(
              `Le compte de ${target.username} à bien été crédité de ${moneyAmount} ChocoCoins`
            )
            .setFields({
              name: `Nouveau montant de ChocoCoins : `,
              value: `${balanceUpdate.chococoins + parseInt(moneyAmount)} ©`,
            });
          collectedEmbed.edit({ embeds: [coinsIncreasedEmbed] });
          embedEdited = true;
          return reactionCollector.stop();
        case emojiList[1]:
          await collectedEmbed.reactions.removeAll();
          balanceUpdate = await ProfileModel.findOneAndUpdate(
            {
              userID: target.id,
            },
            {
              $inc: {
                chococoins: -moneyAmount,
              },
            }
          );
          const coinsDecreasedEmbed = new MessageEmbed()
            .setColor("#F8F70E")
            .setThumbnail(
              `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`
            )
            .setTitle(
              `Le compte de ${target.username} à bien été débité de ${moneyAmount} ChocoCoins`
            )
            .setFields({
              name: `Nouveau montant de ChocoCoins : `,
              value: `${balanceUpdate.chococoins - parseInt(moneyAmount)} ©`,
            });
          collectedEmbed.edit({ embeds: [coinsDecreasedEmbed] });
          embedEdited = true;
          return reactionCollector.stop();
      }
    });
    reactionCollector.on("end", () => {
      if (embedEdited === false) {
        collectedEmbed.reactions.removeAll();
        return collectedEmbed.edit({ embeds: [editedFinalEmbed(message)] });
      }
    });
  },
};
