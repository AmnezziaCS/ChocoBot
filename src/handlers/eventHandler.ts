import { Client } from 'discord.js';
import * as events from '../events/index';

export const eventHandler = (client: Client) => {
  client.on('ready', events.ready.bind(null, client));
  client.on('interactionCreate', events.interactionCreate.bind(null, client));
};
