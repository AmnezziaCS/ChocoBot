import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { CHOCOBO_GIF_LINK } from '../utils/constants';

export const chocobo = {
  data: new SlashCommandBuilder()
    .setName('chocobo')
    .setDescription('Me fait apparaître !')
    .setDMPermission(false),
  aliases: ['hocobo'],
  execute({ interaction }: { interaction: CommandInteraction }) {
    return interaction.reply(CHOCOBO_GIF_LINK);
  }
};
