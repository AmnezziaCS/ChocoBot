import { SlashCommandBuilder } from '@discordjs/builders';
import {
  MessageEmbed,
  type Client,
  type CommandInteraction,
  type Guild,
  type Message,
  type MessageCollector
} from 'discord.js';
import { ServerModel, type ServerData } from '../models/serverSchema';
import { getServerData } from '../serverDataMethods/getServerData';
import { updateServerRecord } from '../serverDataMethods/updateServerRecord';
import { discordEmojiArray, embedColorCode } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/getDiscordUserAvatarURL';

type rankingArray = Array<{
  id: string;
  countingRecord: number;
}>;

export const counting = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('Lance une chaîne de counting.')
    .addStringOption((option) =>
      option
        .setName('option')
        .setDescription('Option en plus pour la commande.')
        .addChoices(
          { name: 'Voir le leaderboard', value: 'lb' },
          { name: "Voir plus d'infos", value: 'help' }
        )
    )
    .setDMPermission(false),
  async execute({
    client,
    interaction
  }: {
    client: Client;
    interaction: CommandInteraction;
  }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);

    if (interaction.options.getString('option') === 'help') {
      await helpEmbed(interaction, avatarUrl);
      return;
    }
    if (interaction.options.getString('option') === 'lb') {
      await lbEmbed(interaction, client, avatarUrl);
      return;
    }

    const serverData = await getServerData(interaction.guildId as string); // We can type assert because commands can never be used in DMs
    if (!serverData) {
      await interaction.reply({
        content:
          'Une erreur est survenue lors de la récupération des données du serveur, veuillez réessayer.',
        ephemeral: true
      });
      return;
    }

    const countingStartsEmbed = new MessageEmbed()
      .setColor(embedColorCode)
      .setTitle("L'événement de comptage a commencé !")
      .setDescription(
        "Il vous faut maintenant compter de 1 en 1 sans faire d'erreurs pour peut-être battre le record du serveur !"
      );
    await interaction.reply({ embeds: [countingStartsEmbed] });

    let currentCount = 1;

    const colletorFilter = (message: Message) => !message.author.bot;
    const collector = interaction.channel?.createMessageCollector({
      filter: colletorFilter,
      time: 60000
    }) as MessageCollector;

    collector.on('collect', (countMessage: Message) => {
      if (!Number.isInteger(parseInt(countMessage.content))) return;

      const countResult = Math.floor(
        eval(countMessage.content.replace(/\s+/g, ''))
      );

      if (countResult != currentCount) {
        countMessage.react('❌');
        interaction.channel?.send(
          `> La chaîne a été cassée ${discordEmojiArray.SADGE}`
        );
        collector.stop();
        return;
      }

      collector.resetTimer();
      currentCount += 1;

      if (serverData.countingRecord < currentCount) {
        countMessage.react('☑');
      } else {
        countMessage.react('✅');
      }
    });

    collector.on('end', async (): Promise<void> => {
      const accurateCurrentCount = currentCount - 1;
      const countingStartsEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setTitle("L'événement de comptage est maintenant terminé !")
        .setDescription(
          `La chaîne a été cassée par une erreur ou par manque de temps ${discordEmojiArray.AGONY} !`
        )
        .setFields({
          name: 'Le record du serveur est :',
          value: `${
            serverData.countingRecord >= accurateCurrentCount
              ? serverData.countingRecord
              : accurateCurrentCount
          }`
        });

      if (serverData.countingRecord >= accurateCurrentCount) {
        interaction.channel?.send({
          embeds: [countingStartsEmbed]
        });
        return;
      }

      await updateServerRecord(serverData.serverID, accurateCurrentCount);

      interaction.channel?.send({
        embeds: [countingStartsEmbed]
      });
    });
  }
};

const helpEmbed = async (
  interaction: CommandInteraction,
  avatarUrl: string
): Promise<void> => {
  const helpEmbed = new MessageEmbed()
    .setColor(embedColorCode)
    .setThumbnail(avatarUrl)
    .setTitle('Counting')
    .setDescription(
      "La commande counting vous permet de compter dans l'ordre croissant, ceci dit, si vous faites une erreur, la chaîne se cassera et il faudra recommencer !"
    );
  await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
};

const lbEmbed = async (
  interaction: CommandInteraction,
  client: Client,
  avatarUrl: string
) => {
  const serverData = await getServerData(interaction.guildId as string);
  if (!serverData) {
    await interaction.reply({
      content:
        'Une erreur est survenue lors de la récupération des données du serveur, veuillez réessayer.',
      ephemeral: true
    });
    return;
  }

  const allValuesOfDB: ServerData[] = await ServerModel.find();
  const sortedTab = sortTabByRecordAsc(allValuesOfDB);
  const authorServerRank = sortedTab.findIndex((server) => {
    return server.id === (interaction.guildId as string);
  });

  const authorServerString =
    authorServerRank > 9
      ? `\n\n ${authorServerRank + 1} - # ${interaction.guildId as string} => ${
          serverData.countingRecord
        }`
      : '';

  const fetchServer = async (
    sortedTab: rankingArray,
    i: number
  ): Promise<Guild> => {
    return await client.guilds.fetch(sortedTab[i].id);
  };

  const fillTab: Guild[] = [];
  const forSize = sortedTab.length <= 10 ? sortedTab.length : 10;
  for (let i = 0; i < forSize; i++) {
    if (client.guilds.cache.has(sortedTab[i].id)) {
      fillTab.push(await fetchServer(sortedTab, i));
    }
  }

  let lbString = '``` ';
  for (let i = 0; i < fillTab.length; i++) {
    const stringIfNotFirst = i === 0 ? '' : '\n\n ';
    lbString += `${stringIfNotFirst}${i + 1} # ${fillTab[i].name} => ${
      sortedTab[i].countingRecord
    }`;
  }
  lbString += `${authorServerString}\`\`\``;

  const leaderboardEmbed = new MessageEmbed()
    .setColor(embedColorCode)
    .setAuthor({
      name: 'Leaderboard Global du counting:',
      iconURL: avatarUrl
    })
    .setDescription(lbString);
  await interaction.reply({ embeds: [leaderboardEmbed] });
};

const sortTabByRecordAsc = (serveDataArray: ServerData[]) => {
  const rankingArray = serveDataArray.reduce(
    (acc: rankingArray, cur): rankingArray => {
      acc.push({ id: cur.serverID, countingRecord: cur.countingRecord });
      return acc;
    },
    []
  );

  return rankingArray.sort((a, b) => b.countingRecord - a.countingRecord);
};
