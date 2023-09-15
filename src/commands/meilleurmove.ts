import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const meilleurmove = {
  data: new SlashCommandBuilder()
    .setName('meilleurmove')
    .setDescription('La vidéo du meilleur move !')
    .setDMPermission(false),
  execute({ interaction }: { interaction: CommandInteraction }) {
    interaction.reply({
      files: [
        {
          attachment: './media/videos/meilleurmove.mp4',
          name: 'meilleurmove.mp4'
        }
      ]
    });
  }
};
