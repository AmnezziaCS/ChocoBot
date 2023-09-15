import { Client } from 'discord.js';
import * as commands from '../commands/index';

export const commandHandler = (client: Client) => {
  Object.values(commands).forEach((command) => {
    if (command.data.name) {
      client.commands.set(command.data.name, command);
    }
  });
};
