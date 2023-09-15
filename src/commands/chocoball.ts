import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { discordEmojiArray } from '../utils/constants';
import { getRandomInt } from '../utils/getRandomInt';

const answersArray = [
  `Re-demander plus tard ${discordEmojiArray.PEPOG}`,
  `Certainement ${discordEmojiArray.WAITING}`,
  `Absolument ${discordEmojiArray.DCOLON} !!!`,
  `Je n'en suis pas certain ${discordEmojiArray.HMMM}`,
  `Pas du tout ${discordEmojiArray.NOPERS}`,
  `Je ne me prononcerais pas ${discordEmojiArray.YEP}`,
  `Non ${discordEmojiArray.NOPERS}`,
  `Concentrez vous et re-demandez ${discordEmojiArray.PEPOG}`,
  `Oui ${discordEmojiArray.NODDERS}`
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
