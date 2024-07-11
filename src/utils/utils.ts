import { User } from 'discord.js';

export const getDiscordUserAvatarURL = (user: User): string => {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`;
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
