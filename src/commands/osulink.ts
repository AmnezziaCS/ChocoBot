import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getUser } from '../osuAPI/getUser';
import { upsertOsuUserID } from '../profileDataMethods/upsertOsuUserID';
import { EMBED_COLOR_CODE } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

export const osulink = {
  data: new SlashCommandBuilder()
    .setName('osulink')
    .setDescription('Permet de lier votre profil osu à votre compte discord.')
    .addIntegerOption((option) =>
      option
        .setName('id')
        .setDescription("L'id du profil osu à lier.")
        .setRequired(true)
    )
    .setDMPermission(false),
  aliases: ['olink', 'ol'],
  async execute({ interaction }: { interaction: CommandInteraction }) {
    const discordAvatarUrl = getDiscordUserAvatarURL(interaction.user);
    const osuUserID = interaction.options.getInteger('id') as number;
    const osuUser = await getUser(osuUserID);

    if (!osuUser) {
      const wrongIDEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Votre ID ${osuUserID} n'est pas valable, merci de choisir un ID correct !`,
          iconURL: discordAvatarUrl
        });
      return interaction.reply({ embeds: [wrongIDEmbed] });
    }

    upsertOsuUserID(interaction.user.id, osuUserID.toString());

    const osuLinkFinalResponseEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR_CODE)
      .setAuthor({
        name: `Le compte osu ${osuUser.username} a bien été lié à votre Discord !`,
        iconURL: `${osuUser.avatar_url}.jpeg`
      });
    return interaction.reply({ embeds: [osuLinkFinalResponseEmbed] });
  }
};
