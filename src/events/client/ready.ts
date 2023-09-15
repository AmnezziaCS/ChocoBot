import { Client } from 'discord.js';

export const ready = (client: Client) => {
  if (!client.user) throw new Error('Client not ready');
  client.user.setActivity('Manger du chocolat');
  client.user.setStatus('idle');

  console.log(
    `🚀 Connecté en tant que ${client.user.tag}!\n\n⏳ Écoute des commandes en cours :`
  );
};
