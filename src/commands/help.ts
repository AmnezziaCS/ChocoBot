import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { embedColorCode } from '../utils/constants';
import { getDiscordUserAvatarURL } from '../utils/getDiscordUserAvatarURL';
const { paginationEmbed } = require('../utils/paginate');

export const help = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Une commande qui les donne toutes !')
    .setDMPermission(false),
  aliases: ['h'],
  async execute({ interaction }: { interaction: CommandInteraction }) {
    const avatarUrl = getDiscordUserAvatarURL(interaction.user);

    const help1 = new MessageEmbed()
      .setColor(embedColorCode)
      .setAuthor({
        name: `Commandes Basiques`,
        iconURL: avatarUrl
      })
      .addFields(
        { name: '`chocobo`', value: 'Me fait apparaître !' },
        {
          name: '`ratio [mention de la personne voulue]`',
          value: `Ratio la personne mentionnée !`
        },
        { name: '`counterratio`', value: `Contre le ratio ennemi !` },
        {
          name: '`meilleurmove`',
          value: `Le piii, le meill, Le meilleurrrrrr moooveeeeeee !`
        },
        {
          name: '`chocoball [question]`',
          value: `Une question ? Demandez à la boule magique !`
        },
        {
          name: '`counting [help (optionnel)] [lb (optionnel)]`',
          value: `Permet de commencer une chaîne de counting ou de regarder le leaderboard associé.`
        }
      );
    const help2 = new MessageEmbed()
      .setColor(embedColorCode)
      .setAuthor({
        name: `Commandes Banquières`,
        iconURL: avatarUrl
      })
      .addFields(
        {
          name: '`balance [mention de la personne voulue (optionnel)]`',
          value:
            'Permet de consulter votre solde de ChocoCoins ainsi que celui des autres !'
        },
        {
          name: '`leaderboard`',
          value: `Affiche le leaderboard global des chococoins !`
        },
        {
          name: '`daily`',
          value: `Vous permet de récolter des ChocoCoins chaque jour !`
        },
        {
          name: '`rob [mention de la personne voulue]`',
          value: `Permet de voler les ChocoCoins d'un utilisateur ou l'inverse.... !`
        },
        {
          name: '`bet [somme mise en jeu]`',
          value: `Lancement d'un dé, soit la somme misée est doublée soit elle est perdue à jamais !`
        }
      );
    const help3 = new MessageEmbed()
      .setColor(embedColorCode)
      .setAuthor({
        name: `Commandes Osu!`,
        iconURL: avatarUrl
      })
      .addFields(
        {
          name: '`osulink [Id de joueur osu]`',
          value:
            "Permet de lier votre compte osu à votre compte discord afin d'utiliser les autres commandes !"
        },
        {
          name: '`osuprofile [nom de joueur osu / id de joueur osu (optionnel)]`',
          value: `Affiche votre profil ou celui de la personne donnée !`
        },
        {
          name: '`recent [nom de joueur osu / id de joueur osu (optionnel)]`',
          value: `Affiche votre dernier score osu en date ou celui de la personne donnée !`
        }
      );

    const pages = [help1, help2, help3];
    const emojis = ['⬅️', '➡️'];
    paginationEmbed(interaction, pages, emojis, 60000);
  }
};
