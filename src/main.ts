import { Client, Collection, Intents } from 'discord.js';
import { connectToDB } from './connectToDB.ts';
import { ENV } from './env.ts';
import * as handlers from './handlers/index.ts';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});
client.commands = new Collection();
client.events = new Collection();

Object.values(handlers).forEach((handler) => handler(client));
connectToDB();
client.login(ENV.DISCORD_TOKEN);

process.on('unhandledRejection', (err) => console.error(err)); // Will be deprecated in the future https://github.com/amnezziaa/ChocoBot/issues/34
