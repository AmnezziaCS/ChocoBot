import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { DISCORD_EMOTES_ARRAY } from '../utils/constants';

export const counterratio = {
  data: new SlashCommandBuilder()
    .setName('counterratio')
    .setDescription("Permet de soutenir quelqu'un dans son contre ratio !")
    .setDMPermission(false),
  aliases: ['ounterratio'],
  execute({ interaction }: { interaction: CommandInteraction }) {
    return interaction
      .reply({
        content: `Je soutiens ${interaction.user.username} dans son contre ratio ${DISCORD_EMOTES_ARRAY.MADGE}`,
        fetchReply: true
      })
      .then((sentEmbed) => {
        // @ts-ignore - DiscordJS used version allows this
        sentEmbed.react(DISCORD_EMOTES_ARRAY.UPVOTE);
      });
  }
};
