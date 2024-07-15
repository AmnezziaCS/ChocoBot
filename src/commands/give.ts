import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, User } from 'discord.js';
import { ENV } from '../env';
import { getProfileData } from '../profileDataMethods/getProfileData';
import { updateUserChococoins } from '../profileDataMethods/updateUserChococoins';
import { DISCORD_EMOTES_ARRAY, EMBED_COLOR_CODE } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';

export const give = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription(
      "Permet de donner des chococoins, cette commande est réservée à l'admin du bot"
    )
    .addIntegerOption((option) =>
      option
        .setName('montant')
        .setDescription(
          'Le montant en coins que vous souhaitez donner ou retirer.'
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription("L'utilisateur à qui vous souhaitez donner ou retirer.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('methode')
        .setDescription(
          'Choisissez si vous voulez ajouter ou retirer des coins.'
        )
        .setRequired(true)
        .addChoices(
          { name: 'Ajouter', value: 'add' },
          { name: 'Retirer', value: 'remove' }
        )
    )
    .setDMPermission(false),
  async execute({ interaction }: { interaction: CommandInteraction }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);

    if (interaction.user.id !== ENV.BOT_OWNER_ID) {
      const permissionsWrongEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Vous ne pouvez pas utiliser cette commande`,
          iconURL: avatarUrl
        });
      return interaction.reply({
        embeds: [permissionsWrongEmbed],
        ephemeral: true
      });
    }

    const moneyAmount = interaction.options.getInteger('montant') as number;
    const target = interaction.options.getUser('utilisateur') as User;
    const method = interaction.options.getString('methode') as string;

    if (target.bot) {
      const botTargetEmbed = new MessageEmbed().setColor('#F8F70E').setAuthor({
        name: `Vous ne pouvez pas utiliser cette commande sur les bots !`,
        iconURL: avatarUrl
      });
      return interaction.reply({ embeds: [botTargetEmbed], ephemeral: true });
    }

    const targetProfileData = await getProfileData(
      target.id,
      interaction.guildId as string
    ); // We can type assert because commands can never be used in DMs
    if (!targetProfileData) {
      return interaction.reply({
        content: `La personne que vous avez essayé de créditer n'a pas de compte, veuillez réessayer ${DISCORD_EMOTES_ARRAY.WAITING}}`,
        ephemeral: true
      });
    }

    const updateValue =
      method === 'add'
        ? targetProfileData.chococoins + moneyAmount
        : targetProfileData.chococoins - moneyAmount;

    await updateUserChococoins(target.id, updateValue);

    const giveResponseEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR_CODE)
      .setThumbnail(getDiscordUserAvatarURL(target))
      .setTitle(
        `Le compte de ${target.username} a bien été ${
          method === 'add' ? 'crédité' : 'décrédité'
        } de ${moneyAmount} ChocoCoins`
      )
      .setFields({
        name: `Nouveau montant de ChocoCoins : `,
        value: `${updateValue} ©`
      });
    return interaction.reply({ embeds: [giveResponseEmbed] });
  }
};
