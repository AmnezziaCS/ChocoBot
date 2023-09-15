import { REST } from '@discordjs/rest';
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes
} from 'discord-api-types/v9';
import * as commands from '../commands/index';
import { ENV } from '../env';

export const slashCommandHandler = async () => {
  const commandsArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

  console.log('⏲️ Chargement des commandes slash...');
  Object.values(commands).forEach((command) => {
    if (command.data.name) {
      commandsArray.push(command.data.toJSON());
      console.log(`📝 Commande \`${command.data.name}\` chargée !`);
    }
  });
  const rest = new REST({ version: '10' }).setToken(ENV.DISCORD_TOKEN);
  await rest.put(Routes.applicationCommands(ENV.DISCORD_BOT_ID), {
    body: commandsArray
  });
  console.log('🎉 Les commandes slash ont été créées avec succés !');
};
