import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { getProfileData } from '../profileDataMethods/getProfileData';
import { EMBED_COLOR_CODE } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

export const balance = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription(
      `Affiche votre profil de monnaie ou celui de la personne que vous souhaitez.`
    )
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription(
          'La mention de la personne dont vous souhaitez consulter la monnaie.'
        )
    )
    .setDMPermission(false),
  aliases: ['bl', 'bal', 'b'],
  async execute({
    interaction,
    profileData
  }: {
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);
    const target = interaction.options?.getUser('utilisateur');

    if (!target) {
      const authorBalanceEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setThumbnail(avatarUrl)
        .setTitle(`Les thunasses de ${interaction.user.username}`)
        .setFields({
          name: `Montant de ChocoCoins : `,
          value: `${profileData.chococoins} ©`
        });
      return interaction.reply({ embeds: [authorBalanceEmbed] });
    }
    if (target.bot) {
      const botTargetEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Vous ne pouvez pas utiliser cette commande sur les bots !`,
          iconURL: avatarUrl
        });
      return interaction.reply({ embeds: [botTargetEmbed] });
    }

    const targetProfileData = await getProfileData(
      target.id,
      interaction.guildId as string
      // We can type assert because commands can never be used in DMs
    );

    if (!targetProfileData) {
      const profileCreatedEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Le profil de ${target.username} a été créé`,
          iconURL: getDiscordUserAvatarURL(target)
        });
      return interaction.reply({
        embeds: [profileCreatedEmbed]
      });
    }

    const targetBalanceEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR_CODE)
      .setThumbnail(getDiscordUserAvatarURL(target))
      .setTitle(`Les thunasses de ${target.username}`)
      .setFields({
        name: `Montant de ChocoCoins : `,
        value: `${targetProfileData.chococoins} ©`
      });
    return interaction.reply({ embeds: [targetBalanceEmbed] });
  }
};
