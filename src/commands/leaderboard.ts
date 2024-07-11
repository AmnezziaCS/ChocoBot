import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, MessageEmbed, User } from 'discord.js';
import { ProfileData, ProfileModel } from '../models/profileSchema';
import { getDiscordUserAvatarURL } from '../utils/utils';

type rankingArray = {
  id: string;
  coins: number;
}[];

export const leaderboard = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Affiche le leaderboard global des chococoins !')
    .setDMPermission(false),
  aliases: ['lb'],
  async execute({
    client,
    interaction,
    profileData
  }: {
    client: Client;
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const allValuesOfDB: ProfileData[] = await ProfileModel.find();
    const sortedTab = sortTabByChococoinsAsc(allValuesOfDB);

    const authorRank = sortedTab.findIndex((object) => {
      return object.id === interaction.user.id;
    });
    const authorBuffer =
      authorRank > 9
        ? `\n\n ${authorRank + 1} - # ${interaction.user.username} => ${
            profileData.chococoins
          } ©`
        : '';

    const fetchUser = async (
      sortedTab: rankingArray,
      i: number
    ): Promise<User> => {
      return client.users.fetch(sortedTab[i].id);
    };

    const fillTab: User[] = [];
    for (let i = 0; i < 10; i++) {
      fillTab.push(await fetchUser(sortedTab, i));
    }

    const leaderboardEmbed = new MessageEmbed().setColor('#F8F70E').setAuthor({
      name: `Leaderboard Global des ChocoCoins:`,
      iconURL: getDiscordUserAvatarURL(interaction.user)
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
            \n 10 - # ${fillTab[9].username} => ${sortedTab[9].coins} ©${authorBuffer}\`\`\``);
    return interaction.reply({ embeds: [leaderboardEmbed] });
  }
};

const sortTabByChococoinsAsc = (profileDataArray: ProfileData[]) => {
  const rankingArray = profileDataArray.reduce(
    (acc: rankingArray, cur): rankingArray => {
      acc.push({ id: cur.userID, coins: cur.chococoins });
      return acc;
    },
    []
  );

  return rankingArray.sort((a, b) => b.coins - a.coins);
};
