import { User } from 'discord.js';

export const getDiscordUserAvatarURL = (user: User): string => {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`;
};
