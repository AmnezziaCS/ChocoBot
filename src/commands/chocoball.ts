import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DISCORD_EMOTES_ARRAY } from '../utils/constants';
import { getRandomInt } from '../utils/utils';

const answersArray = [
  `Re-demander plus tard ${DISCORD_EMOTES_ARRAY.PEPOG}`,
  `Certainement ${DISCORD_EMOTES_ARRAY.WAITING}`,
  `Absolument ${DISCORD_EMOTES_ARRAY.DCOLON} !!!`,
  `Je n'en suis pas certain ${DISCORD_EMOTES_ARRAY.HMMM}`,
  `Pas du tout ${DISCORD_EMOTES_ARRAY.NOPERS}`,
  `Je ne me prononcerais pas ${DISCORD_EMOTES_ARRAY.YEP}`,
  `Non ${DISCORD_EMOTES_ARRAY.NOPERS}`,
  `Concentrez vous et re-demandez ${DISCORD_EMOTES_ARRAY.PEPOG}`,
  `Oui ${DISCORD_EMOTES_ARRAY.NODDERS}`
];

export const chocoball = {
  data: new SlashCommandBuilder()
    .setName('chocoball')
    .setDescription('Posez une question à la boule magique.')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('La question à poser à la boule magique.')
        .setRequired(true)
    )
    .setDMPermission(false),
  aliases: ['ball', 'hocoball'],
  execute({ interaction }: { interaction: CommandInteraction }) {
    const content = interaction.options.getString('question') as string;
    const questionPlaceholder = `\`(${
      interaction.user.username
    }) : ${questionMarkMapper(content)}\``;

    return interaction.reply(
      `${questionPlaceholder} ► ${answersArray[getRandomInt(9)]}`
    );
  }
};

const questionMarkMapper = (content: string): string => {
  return content.endsWith('?') ? content : content + ' ?';
};
