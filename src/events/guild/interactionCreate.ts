import { Client, Interaction } from 'discord.js';
import { getProfileData } from '../../profileDataMethods/getProfileData';
import { discordEmojiArray } from '../../utils/constants';

export const interactionCreate = async (
  client: Client,
  interaction: Interaction
) => {
  if (!interaction.isCommand()) return;

  const profileData = await getProfileData(
    interaction.user.id,
    interaction.guildId as string
  ); // We can type assert because commands can never be used in DMs

  const command =
    client.commands.get(interaction.commandName) ||
    client.commands.find(
      (command) =>
        command.aliases && command.aliases.includes(interaction.commandName)
    );

  if (!command) {
    return interaction.reply({
      content: `Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée ${discordEmojiArray.HMMM}`,
      ephemeral: true
    });
  }

  const parameterBuffer = interaction.options.data.reduce(
    (acc: string, cur) => {
      return acc + ' ' + cur.value;
    },
    ''
  );
  const discriminator =
    interaction.user.discriminator === '0'
      ? ''
      : `#${interaction.user.discriminator}`;

  console.log(
    `(${new Date().toLocaleString()}) - ${
      interaction.user.username
    }${discriminator}: /${interaction.commandName}${parameterBuffer}`
  );

  try {
    if (!profileData) {
      return interaction.reply({
        content: `Quelque chose n'a pas tourné rond, bizarre. Vos statistiques n'ont pas pu être récupérées ${discordEmojiArray.WAITING}`,
        ephemeral: true
      });
    }
    await command.execute({ client, interaction, profileData });
  } catch (err) {
    interaction.reply({
      content: `Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée ${discordEmojiArray.HMMM}}`,
      ephemeral: true
    });
    console.log('Caught error:', err);
  }
};
