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

// Will be deprecated in the future https://github.com/AmnezziaCS/ChocoBot/issues/34
process.on('unhandledRejection', (err) => console.error(err));
