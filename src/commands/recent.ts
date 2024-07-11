import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { getUser } from '../osuAPI/getUser';
import { getUserRecentScore } from '../osuAPI/getUserRecentScore';
import {
  embedColorCode,
  osuEmojiGradesArray,
  voyelArray
} from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

export const recent = {
  data: new SlashCommandBuilder()
    .setName('recent')
    .setDescription('Renvoie votre dernier play osu en date !')
    .addStringOption((option) =>
      option
        .setName('utilisateur')
        .setDescription(
          'Le pseudo ou id de la personne dont vous souhaitez voir le dernier play.'
        )
    )
    .setDMPermission(false),
  aliases: ['r', 'rs'],
  async execute({
    interaction,
    profileData
  }: {
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const discordAvatarUrl = getDiscordUserAvatarURL(interaction.user);
    const osuIdString = interaction.options.getString('utilisateur')
      ? interaction.options.getString('utilisateur')
      : await retrieveUserOsuId(profileData);

    if (!osuIdString) {
      const noOsuAccountEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: "Vous n'avez pas lié de compte osu à votre Discord",
          iconURL: discordAvatarUrl
        })
        .setDescription(
          'Veuillez utiliser la commande `c!osulink [id osu]` afin de lier votre compte'
        );

      return interaction.reply({
        embeds: [noOsuAccountEmbed]
      });
    }

    const osuUser = await getUser(osuIdString);
    if (!osuUser) {
      const wrongIDEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: `Le joueur ${osuIdString} n'existe pas !`,
          iconURL: discordAvatarUrl
        });
      return interaction.reply({ embeds: [wrongIDEmbed] });
    }

    const osuId = osuUser.id;
    const userRecentScore = await getUserRecentScore({
      limit: 1,
      userId: osuId
    });

    if (!userRecentScore) {
      const noScoresEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: `Le joueur ${osuUser.username} n'a pas de scores récents !`,
          iconURL: `https://a.ppy.sh/${osuId}?.jpeg`,
          url: `https://osu.ppy.sh/users/${osuId}`
        });
      return interaction.reply({ embeds: [noScoresEmbed] });
    }

    const ppAmount = userRecentScore.pp
      ? userRecentScore.pp.toPrecision(4)
      : '`null`';
    const modsBuffer = userRecentScore.mods.join('') || 'Nomod';

    const recentScoreEmbed = new MessageEmbed()
      .setColor('#F8F70E')
      .setAuthor({
        name: `Le score le plus récent ${
          voyelArray.includes(userRecentScore.user.username[0].toLowerCase())
            ? "d'"
            : 'de '
        }${userRecentScore.user.username} !`,
        iconURL: `https://a.ppy.sh/${osuId}?.jpeg`,
        url: `https://osu.ppy.sh/users/${userRecentScore.user.id}`
      })
      .setTitle(
        `${userRecentScore.beatmapset.title} [${userRecentScore.beatmap.version}] - ${userRecentScore.beatmap.difficulty_rating}*`
      )
      .setURL(`${userRecentScore.beatmap.url}`)
      .setDescription(
        `${osuEmojiGradesArray[userRecentScore.rank]} **(${(
          userRecentScore.accuracy * 100
        ).toPrecision(4)}%) +${modsBuffer}** *played* <t:${
          new Date(userRecentScore.created_at).getTime() / 1000
        }:R>\n**Score :** ${userRecentScore.score.toLocaleString()} **PP : ${ppAmount}**`
      )
      .setThumbnail(
        `https://assets.ppy.sh/beatmaps/${userRecentScore.beatmapset.id}/covers/list.jpg`
      );
    return interaction.reply({ embeds: [recentScoreEmbed] });
  }
};

const retrieveUserOsuId = async (
  profileData: ProfileData
): Promise<string | null> => {
  return profileData?.osuUserID ?? null;
};
