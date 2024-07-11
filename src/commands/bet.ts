import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { updateUserChococoins } from '../profileDataMethods/updateUserChococoins';
import { embedColorCode } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';
import { getRandomInt } from '../utils/utils';

export const bet = {
  data: new SlashCommandBuilder()
    .setName('bet')
    .setDescription(
      `Cette commande permet de miser avec un risque de tout perdre ou de doubler sa mise !`
    )
    .addIntegerOption((option) =>
      option
        .setName('chococoins')
        .setDescription("La somme d'argent à miser.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute({
    interaction,
    profileData
  }: {
    interaction: CommandInteraction;
    profileData: ProfileData;
  }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);
    const betValue = interaction.options.getInteger('chococoins') as number;

    if (betValue <= 0) {
      const negativeBetEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: 'Vous avez voulu bet une valeur négative de chococoins !',
          iconURL: avatarUrl
        })
        .setDescription(
          `Veuillez donner une valeur positive si vous souhaitez bet !`
        );
      return interaction.reply({ embeds: [negativeBetEmbed] });
    }
    if (profileData.chococoins < betValue) {
      const notEnoughCoinsEmbed = new MessageEmbed()
        .setColor(embedColorCode)
        .setAuthor({
          name: 'Votre solde de ChocoCoins est insuffisant',
          iconURL: avatarUrl
        })
        .setFields({
          name: `Votre avez bet ${betValue} ChocoCoins alors que vous n'en possédez que : `,
          value: `${profileData.chococoins} ©`
        });
      return interaction.reply({
        embeds: [notEnoughCoinsEmbed]
      });
    }

    const betResult = getRandomInt(2);
    const updateValue =
      betResult === 1
        ? profileData.chococoins + betValue
        : profileData.chococoins - betValue;
    await updateUserChococoins(interaction.user.id, updateValue);

    const betResultEmbedTitle =
      betResult === 1 ? 'Bravo, vous avez gagné !' : 'Non, vous avez perdu !';
    const betResultEmbedField =
      betResult === 1
        ? `Votre compte a été crédité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `
        : `Votre compte à été débité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `;
    const betResultEmbed = new MessageEmbed()
      .setColor(embedColorCode)
      .setThumbnail(avatarUrl)
      .setTitle(betResultEmbedTitle)
      .setFields({
        name: betResultEmbedField,
        value: `${updateValue} ©`
      });
    return interaction.reply({
      embeds: [betResultEmbed]
    });
  }
};
