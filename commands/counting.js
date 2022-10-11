const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ServerModel = require("../models/serverSchema");

const helpEmbed = (unifiedInteraction) => {
  const helpEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setThumbnail(
      `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`
    )
    .setTitle(`Counting`)
    .setDescription(
      "La commande counting vous permet de compter dans l'ordre croissant, ceci dit, si vous faites une erreur, la chaîne se cassera et il faudra recommencer !"
    )
    .setFields({
      name: "`c!counting / count [help] [lb]`",
      value:
        "Le leaderboard global des records inter-serveurs est disponible en ajoutant [lb] après la commande !",
    });
  return unifiedInteraction.message.reply({ embeds: [helpEmbed] });
};

const lbEmbed = async (unifiedInteraction, client) => {
  const sortTabByRecordAsc = (all) => {
    let tab = new Array();
    all.forEach((element) => {
      const pair = {};
      let myPair = Object.create(pair);
      pair.id = element.serverID;
      pair.record = element.countingRecord;
      tab.push(pair);
    });

    tab.sort((a, b) => parseFloat(b.coins) - parseFloat(a.coins));
    return tab;
  };

  serverData = await ServerModel.findOne({
    serverID: unifiedInteraction.guild.id,
  });
  if (!serverData) {
    let serverProfile = await ServerModel.create({
      serverID: unifiedInteraction.guild.id,
      countingRecord: 0,
    });
    serverProfile.save();
  }

  const allValuesOfDB = await ServerModel.find();
  const sortedTab = sortTabByRecordAsc(allValuesOfDB);
  let authorServerString = "";

  const authorServerRank = sortedTab.findIndex((object) => {
    return object.id === unifiedInteraction.guild.id;
  });

  if (authorServerRank > 9) {
    authorServerString = `\n\n ${authorServerRank + 1} - # ${
      unifiedInteraction.guild.name
    } => ${serverData.countingRecord}`;
  }

  const fetchServer = async (sortedTab, i) =>
    client.guilds.fetch(sortedTab[i].id);
  fillTab = new Array();
  forSize = sortedTab.length <= 10 ? sortedTab.length : 10;
  for (i = 0; i < forSize; i++) {
    if (client.guilds.cache.has(sortedTab[i].id))
      fillTab.push(await fetchServer(sortedTab, i));
  }

  lbString = `\`\`\` `;
  for (i = 0; i < fillTab.length; i++) {
    stringIfNotFirst = i === 0 ? `` : `\n\n `;
    lbString += `${stringIfNotFirst}${i + 1} # ${fillTab[i].name} => ${
      sortedTab[i].record
    }`;
  }
  lbString += `${authorServerString}\`\`\``;

  const leaderboardEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setAuthor({
      name: `Leaderboard Global du counting:`,
      iconURL: `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`,
    })
    .setDescription(lbString);
  return unifiedInteraction.message.reply({ embeds: [leaderboardEmbed] });
};

const countingStartsEmbed = (unifiedInteraction) => {
  const countingStartsEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setTitle(`L'événement de comptage à commencé !`)
    .setDescription(
      "Il vous faut maintenant compter de 1 en 1 sans faire d'erreurs pour peut être battre le record du serveur !"
    )
    .setFields({
      name: "Pour plus d'infos",
      value: "`c!counting / count help`",
    });
  return unifiedInteraction.message.reply({ embeds: [countingStartsEmbed] });
};

const countingEndsEmbed = (unifiedInteraction, serverCountingRecord) => {
  const countingStartsEmbed = new MessageEmbed()
    .setColor("#F8F70E")
    .setTitle(`L'événement de comptage est maintenant terminé !`)
    .setDescription(
      `La chaîne a été cassée par une erreur ou par manque de temps <:agony:918124977352499200> !`
    )
    .setFields({
      name: "Le record du serveur est :",
      value: `${serverCountingRecord}`,
    });
  return unifiedInteraction.message.channel.send({
    embeds: [countingStartsEmbed],
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription(`Lance une chaîne de counting.`)
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Option en plus pour la commande.")
        .addChoices(
          { name: "Voir le leaderboard", value: "lb" },
          { name: "Voir plus d'infos", value: "help" }
        )
    )
    .setDMPermission(false),
  aliases: ["count"],
  async execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    if (unifiedInteraction.type === "message") {
      if (unifiedInteraction.options[0] === "help") {
        return helpEmbed(unifiedInteraction);
      }
      if (unifiedInteraction.options[0] === "lb") {
        return lbEmbed(unifiedInteraction, client);
      }
    } else {
      if (unifiedInteraction.options.getString("option") === "help") {
        return helpEmbed(unifiedInteraction);
      }
      if (unifiedInteraction.options.getString("option") === "lb") {
        return lbEmbed(unifiedInteraction, client);
      }
    }

    serverData = await ServerModel.findOne({
      serverID: unifiedInteraction.guild.id,
    });
    if (!serverData) {
      let serverProfile = await ServerModel.create({
        serverID: unifiedInteraction.guild.id,
        countingRecord: 0,
      });
      serverProfile.save();
    }

    countingStartsEmbed(unifiedInteraction);
    let currentCount = 1;

    const colletorFilter = (message) => !message.author.bot;
    const collector = unifiedInteraction.message.channel.createMessageCollector(
      {
        filter: colletorFilter,
        time: 60000,
      }
    );
    collector.on("collect", (countMessage) => {
      if (!Number.isInteger(parseInt(countMessage))) return;
      countResult = Math.floor(eval(countMessage.content.replace(/\s+/g, "")));
      if (countResult != currentCount) {
        countMessage.react("❌");
        unifiedInteraction.message.channel.send(
          "> La chaîne a été cassée <:Sadge:920699839182954526>"
        );
        return collector.stop();
      }
      collector.resetTimer();
      currentCount += 1;
      if (!serverData) return countMessage.react("☑");
      if (serverData.countingRecord < currentCount)
        return countMessage.react("☑");
      return countMessage.react("✅");
    });
    collector.on("end", async () => {
      if (!serverData) {
        const recordUpdate = await ServerModel.findOneAndUpdate(
          {
            serverID: unifiedInteraction.guild.id,
          },
          {
            $set: {
              countingRecord: currentCount - 1,
            },
          }
        );
        return countingEndsEmbed(unifiedInteraction, currentCount - 1);
      }
      if (serverData.countingRecord >= currentCount - 1)
        return countingEndsEmbed(unifiedInteraction, serverData.countingRecord);

      const recordUpdate = await ServerModel.findOneAndUpdate(
        {
          serverID: unifiedInteraction.guild.id,
        },
        {
          $set: {
            countingRecord: currentCount - 1,
          },
        }
      );
      countingEndsEmbed(unifiedInteraction, currentCount - 1);
    });
  },
};
