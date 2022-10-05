const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");

const sortTabByChococoinsAsc = (all) => {
  let tab = new Array();
  all.forEach((element) => {
    const pair = {};
    let myPair = Object.create(pair);
    pair.id = element.userID;
    pair.coins = element.chococoins;
    tab.push(pair);
  });

  tab.sort((a, b) => parseFloat(b.coins) - parseFloat(a.coins));
  return tab;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Affiche le leaderboard global des chococoins !")
    .setDMPermission(false),
  aliases: ["lb"],
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    // checks if message author has a coin profile

    profileData = await ProfileModel.findOne({
      userID: unifiedInteraction.user.id,
    });
    if (!profileData) {
      return;
    }

    const allValuesOfDB = await ProfileModel.find();
    const sortedTab = sortTabByChococoinsAsc(allValuesOfDB);
    let authorString = "";

    const authorRank = sortedTab.findIndex((object) => {
      return object.id === unifiedInteraction.user.id;
    });

    if (authorRank > 9) {
      authorString = `\n\n ${authorRank + 1} - # ${
        unifiedInteraction.user.username
      } => ${profileData.chococoins} ©`;
    }

    const fetchUser = async (sortedTab, i) =>
      client.users.fetch(sortedTab[i].id);
    fillTab = new Array();
    for (i = 0; i < 10; i++) {
      fillTab.push(await fetchUser(sortedTab, i));
    }

    const leaderboardEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
      name: `Leaderboard Global des ChocoCoins:`,
      iconURL: `https://cdn.discordapp.com/avatars/${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}.jpeg`,
    })
      .setDescription(`\`\`\` 1 ♔ # ${fillTab[0].username} => ${sortedTab[0].coins} ©
            \n 2 - # ${fillTab[1].username} => ${sortedTab[1].coins} ©
            \n 3 - # ${fillTab[2].username} => ${sortedTab[2].coins} ©
            \n 4 - # ${fillTab[3].username} => ${sortedTab[3].coins} ©
            \n 5 - # ${fillTab[4].username} => ${sortedTab[4].coins} ©
            \n 6 - # ${fillTab[5].username} => ${sortedTab[5].coins} ©
            \n 7 - # ${fillTab[6].username} => ${sortedTab[6].coins} ©
            \n 8 - # ${fillTab[7].username} => ${sortedTab[7].coins} ©
            \n 9 - # ${fillTab[8].username} => ${sortedTab[8].coins} ©
            \n 10 - # ${fillTab[9].username} => ${sortedTab[9].coins} ©${authorString}\`\`\``);
    return unifiedInteraction.message.reply({ embeds: [leaderboardEmbed] });
  },
};
