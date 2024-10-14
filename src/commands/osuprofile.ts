import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { getUser } from '../osuAPI/getUser';
import {
  EMBED_COLOR_CODE,
  OSU_GRADES_EMOTES_ARRAY,
  VOYEL_ARRAY
} from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

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
        .setColor(EMBED_COLOR_CODE)
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
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Le joueur ${osuId} n'existe pas !`,
          iconURL: discordAvatarUrl
        });
      return interaction.reply({ embeds: [wrongIDEmbed] });
    }

    const osuProfileEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR_CODE)
      .setAuthor({
        name: `Voici le profil osu ${
          VOYEL_ARRAY.includes(osuUser.username[0].toLowerCase()) ? "d'" : 'de '
        }${osuUser.username} !`,
        iconURL: `https://flagpedia.net/data/flags/icon/120x90/${osuUser.country_code.toLowerCase()}.webp`,
        url: `https://osu.ppy.sh/users/${osuUser.id}`
      })
      .setThumbnail(osuUser.avatar_url)
      .setDescription(
        `• **Rank:** ${
          osuUser.statistics.global_rank
            ? `#${standardizeNumber(osuUser.statistics.global_rank, ',')} (${
                osuUser.country_code
              }#${standardizeNumber(osuUser.statistics.rank.country, ',')})`
            : ' `unranked`'
        }\n• **Ranked score:** ${standardizeNumber(
          osuUser.statistics.ranked_score,
          ' '
        )}\n• **Accuracy:** ${osuUser.statistics.hit_accuracy.toPrecision(
          4
        )}%\n• **Level:** ${osuUser.statistics.level.current}.${
          osuUser.statistics.level.progress
        }\n• **Scores: ${OSU_GRADES_EMOTES_ARRAY.XH}${standardizeNumber(
          osuUser.statistics.grade_counts.ssh,
          ','
        )} ${OSU_GRADES_EMOTES_ARRAY.SH}${standardizeNumber(
          osuUser.statistics.grade_counts.sh,
          ','
        )} ${OSU_GRADES_EMOTES_ARRAY.X}${standardizeNumber(
          osuUser.statistics.grade_counts.ss,
          ','
        )} ${OSU_GRADES_EMOTES_ARRAY.S}${standardizeNumber(
          osuUser.statistics.grade_counts.s,
          ','
        )} ${OSU_GRADES_EMOTES_ARRAY.A}${standardizeNumber(
          osuUser.statistics.grade_counts.a,
          ','
        )}**`
      );
    return interaction.reply({ embeds: [osuProfileEmbed] });
  }
};

const retrieveUserOsuId = async (
  profileData: ProfileData
): Promise<string | null> => {
  return profileData?.osuUserID ?? null;
};

const standardizeNumber = (number: number, replacement: string): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, replacement);
};
