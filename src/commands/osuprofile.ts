import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { getUser } from '../osuAPI/getUser';
import {
  embedColorCode,
  osuEmojiGradesArray,
  voyelArray
} from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/getDiscordUserAvatarURL';

export const osuprofile = {
  data: new SlashCommandBuilder()
    .setName('osuprofile')
    .setDescription("Renvoie l'embed de votre profil osu !")
    .addStringOption((option) =>
      option
        .setName('utilisateur')
        .setDescription(
          "Le nom d'utilisateur ou id de la personne dont vous souhaitez voir le profil osu."
        )
    )
    .setDMPermission(false),
  aliases: ['osu', 'opr'],
  async execute({
    interaction,
    profileData
  }: {
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const discordAvatarUrl = getDiscordUserAvatarURL(interaction.user);
    const osuId = interaction.options.getString('utilisateur')
      ? interaction.options.getString('utilisateur')
      : await retrieveUserOsuId(profileData);

    if (!osuId) {
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

    const osuUser = await getUser(osuId);
    if (!osuUser) {
      const wrongIDEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: `Le joueur ${osuId} n'existe pas !`,
          iconURL: discordAvatarUrl
        });
      return interaction.reply({ embeds: [wrongIDEmbed] });
    }

    const osuProfileEmbed = new MessageEmbed()
      .setColor(embedColorCode)
      .setAuthor({
        name: `Voici le profil osu ${
          voyelArray.includes(osuUser.username[0].toLowerCase()) ? "d'" : 'de '
        }${osuUser.username} !`,
        iconURL: `https://flagpedia.net/data/flags/icon/120x90/${osuUser.country_code.toLowerCase()}.webp`,
        url: `https://osu.ppy.sh/users/${osuUser.id}`
      })
      .setThumbnail(osuUser.avatar_url)
      .setDescription(
        `• **Rank:** ${
          osuUser.statistics.global_rank
            ? '#' +
              osuUser.statistics.global_rank
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              ` (${osuUser.country_code}#${osuUser.statistics.rank.country
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')})`
            : ' `unranked`'
        }\n• **Ranked score:** ${osuUser.statistics.ranked_score
          .toString()
          .replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ' '
          )}\n• **Accuracy:** ${osuUser.statistics.hit_accuracy.toPrecision(
          4
        )}%\n• **Level:** ${osuUser.statistics.level.current}.${
          osuUser.statistics.level.progress
        }\n• **Scores: ${
          osuEmojiGradesArray.XH
        } ${osuUser.statistics.grade_counts.ssh
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
          osuEmojiGradesArray.SH
        } ${osuUser.statistics.grade_counts.sh
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
          osuEmojiGradesArray.X
        } ${osuUser.statistics.grade_counts.ss
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
          osuEmojiGradesArray.S
        } ${osuUser.statistics.grade_counts.s
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
          osuEmojiGradesArray.A
        } ${osuUser.statistics.grade_counts.a
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}**`
      );
    return interaction.reply({ embeds: [osuProfileEmbed] });
  }
};

const retrieveUserOsuId = async (
  profileData: ProfileData
): Promise<string | null> => {
  return profileData?.osuUserID ?? null;
};
