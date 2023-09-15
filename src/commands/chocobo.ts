import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const chocobo = {
  data: new SlashCommandBuilder()
    .setName('chocobo')
    .setDescription('Me fait apparaître !')
    .setDMPermission(false),
  aliases: ['hocobo'],
  execute({ interaction }: { interaction: CommandInteraction }) {
    return interaction.reply(
      'https://tenor.com/view/alpha-ffxiv-chocobo-alphabestboi-gif-19909966'
    );
  }
};
