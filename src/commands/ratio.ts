import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, User } from 'discord.js';
import { ENV } from '../env';
import { discordEmojiArray } from '../utils/constants';

export const ratio = {
  data: new SlashCommandBuilder()
    .setName('ratio')
    .setDescription('Ratio la personne mentionnée !')
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('La mention de la personne à ratio.')
        .setRequired(true)
    )
    .setDMPermission(false),
  execute({ interaction }: { interaction: CommandInteraction }) {
    const target = interaction.options?.getUser('utilisateur') as User;

    if (interaction.user.id === target.id) {
      return interaction.reply(
        `Tu veux te ratio toi-même, bizarre ${discordEmojiArray.WAITING}`
      );
    }
    if (ENV.DISCORD_BOT_ID === target.id) {
      return interaction.reply(
        `Tu crois vraiment que tu peux me ratio ${discordEmojiArray.HMMM} ?`
      );
    }

    return interaction
      .reply({
        content: `Je ratio ${target} ${discordEmojiArray.YEP} !`,
        fetchReply: true
      })
      .then((sentEmbed) => {
        // @ts-ignore - DiscordJS used version allows this
        sentEmbed.react(`${discordEmojiArray.UPVOTE}`);
      });
  }
};
