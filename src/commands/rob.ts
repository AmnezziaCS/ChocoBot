import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, User } from 'discord.js';
import { ProfileData } from '../models/profileSchema';
import { getProfileData } from '../profileDataMethods/getProfileData';
import { updateUserChococoins } from '../profileDataMethods/updateUserChococoins';
import { DISCORD_EMOTES_ARRAY, EMBED_COLOR_CODE } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/utils';
import { getRandomInt } from '../utils/utils';

export const rob = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription(
      "Cette commande vous permet de voler de l'argent à quelqu'un !"
    )
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('La mention de la personne que vous souhaitez voler.')
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
    const target = interaction.options.getUser('utilisateur') as User;

    if (target === interaction.user) {
      return interaction.reply({
        content: `Vous ne pouvez pas vous voler vous-même !`,
        ephemeral: true
      });
    }
    if (target.bot) {
      return interaction.reply({
        content: `Vous ne pouvez pas voler un bot !`,
        ephemeral: true
      });
    }

    const targetProfileData = await getProfileData(
      target.id,
      interaction.guildId as string
    ); // We can type assert because commands can never be used in DMs
    if (!targetProfileData) {
      return interaction.reply({
        content: `La personne que vous avez essayé de voler n'a pas de compte, veuillez réessayer ${DISCORD_EMOTES_ARRAY.WAITING}}`,
        ephemeral: true
      });
    }
    if (profileData.chococoins < 1000 || targetProfileData.chococoins < 1000) {
      const notEnoughMoneyEmbed = new MessageEmbed()
        .setColor(EMBED_COLOR_CODE)
        .setAuthor({
          name: `Vous ou la personne que vous avez essayé de rob possède moins de 1000 ChocoCoins, par conséquent, vous ne pouvez utiliser cette commande !`,
          iconURL: avatarUrl
        });
      return interaction.reply({
        embeds: [notEnoughMoneyEmbed]
      });
    }

    const smallUpdate = 100;
    const bigUpdate = 500;

    const robResult = getRandomInt(5);
    const robUpdateAmount = [0, 1, 3].includes(robResult)
      ? smallUpdate
      : bigUpdate;
    const resultEmbedTitle = getResultEmbedTitle({
      robResult,
      target: target,
      updateValue: robUpdateAmount
    });
    const updateSchema = {
      authorUpdateValue: [0, 1, 2].includes(robResult)
        ? profileData.chococoins - robUpdateAmount
        : profileData.chococoins + robUpdateAmount,
      targetUpdateValue: [0, 1, 2].includes(robResult)
        ? targetProfileData.chococoins + robUpdateAmount
        : targetProfileData.chococoins - robUpdateAmount
    };

    await updateProfiles({
      userId: interaction.user.id,
      targetId: target.id,
      updateSchema
    });

    const robResultEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR_CODE)
      .setThumbnail(avatarUrl)
      .setTitle(resultEmbedTitle)
      .setFields({
        name: `Votre nouveau montant de ChocoCoins est : `,
        value: `${updateSchema.authorUpdateValue} ©`
      });
    return interaction.reply({ embeds: [robResultEmbed] });
  }
};

const getResultEmbedTitle = ({
  robResult,
  target,
  updateValue
}: {
  robResult: number;
  target: User;
  updateValue: number;
}): string => {
  if ([0, 1].includes(robResult)) {
    return `En essayant de voler ${target.username}, vous vous êtes pris un mur et avez perdu ${updateValue} © !`;
  } else if (robResult === 2) {
    return `En essayant de voler ${target.username}, vous vous êtes fait arrêter et avez du lui donner ${updateValue} © !`;
  } else if (robResult === 3) {
    return `Vous avez réussi à voler ${target.username}, vous lui avez fait les poches et récupérez ${updateValue} © !`;
  }
  return `Vous avez réussi à voler ${target.username}, vous repartez avec sa carte de crédit qui contenait ${updateValue} © !`;
};

const updateProfiles = async ({
  userId,
  targetId,
  updateSchema
}: {
  userId: string;
  targetId: string;
  updateSchema: {
    authorUpdateValue: number;
    targetUpdateValue: number;
  };
}): Promise<void> => {
  await updateUserChococoins(userId, updateSchema.authorUpdateValue);
  await updateUserChococoins(targetId, updateSchema.targetUpdateValue);
};
