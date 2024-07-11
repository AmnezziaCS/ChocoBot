import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { updateProfileDataDaily } from '../profileDataMethods/updateProfileDataDaily';
import { embedColorCode } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

const dayInMilliseconds = 86400000;

export const daily = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Permet de récupérer des ChocoCoins chaque jour.')
    .setDMPermission(false),
  aliases: ['d'],
  async execute({
    interaction,
    profileData
  }: {
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);
    const differenceInDays =
      (new Date().getTime() - profileData.dailyCheck.getTime()) /
      dayInMilliseconds;

    if (differenceInDays < 1) {
      const dailyClaimDate = new Date().setDate(
        profileData.dailyCheck.getDate() + 1
      );

      const dailyFailedEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setThumbnail(avatarUrl)
        .setTitle(`Votre daily n'est pas disponible pour le moment !`)
        .setFields({
          name: `Vous pourrez utiliser votre daily :`,
          value: `<t:${Math.round(dailyClaimDate / 1000)}:R>`
        });
      return interaction.reply({ embeds: [dailyFailedEmbed] });
    }

    await updateProfileDataDaily(interaction.user.id);

    const dailySuccessfullEmbed = new MessageEmbed()
      .setColor(embedColorCode)
      .setThumbnail(avatarUrl)
      .setTitle(`Votre compte a bien été crédité de 2000 ChocoCoins`)
      .setFields({
        name: `Nouveau montant de ChocoCoins : `,
        value: `${profileData.chococoins + 2000} ©`
      });
    return interaction.reply({
      embeds: [dailySuccessfullEmbed]
    });
  }
};
