const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Une commande qui les donnent toutes !'),
    async execute(client, message, args) {

        const help1 = new MessageEmbed()
            .setColor('#F8F70E')
            .setTitle('Commandes Basiques')
            .setDescription("Format type : `!c [commande]`. \n\nVoici les commandes classiques, la page numéro 2 est consacrée aux commandes de type économie. <:YEP:800841093515444244>.")
            .addFields(
                { name: '`Hocobo`', value: 'Me fait apparaître !' },
                { name: '`Ratio [mention de la personne voulue]`', value: `Ratio la personne mentionnée !` },
                { name: '`Ounterratio`', value: `Contre le ratio ennemi !` },
                { name: '`Meilleurmove`', value: `Le piii, le meill, Le meilleurrrrrr moooveeeeeee !` },
                { name: '`Hocoball [question ?]`', value: `Une question ? Demandez à la boule magique !` },
                { name: '`Um`', value: `N'utilisez pas cette commande pitié 😳.` }
            )
        const help2 = new MessageEmbed()
            .setColor('#F8F70E')
            .setTitle('Commandes Banquières')
            .setDescription("Format type : `!c [commande]`. \n\nVous êtes à présent sur la page dediée aux commandes de type économie, Stonksez un max <:Stonks:814078917626691605>.")
            .addFields(
                { name: '`Balance [mention de la personne voulue (optionnel)]`', value: 'Permet de consulter votre solde de ChocoCoins ainsi que celui des autres !' },
                { name: '`Leaderboard`', value: `Affiche le leaderboard global des chococoins !` },
                { name: '`Daily`', value: `Vous permet de récolter des ChocoCoins chaque jour !` },
                { name: '`Rob [mention de la personne voulue]`', value: `Permet de voler les ChocoCoins d'un utilisateur ou l'inverse.... !` },
                { name: '`Bet [somme mise en jeu]`', value: `Lancement d'un dé, soit la somme misée est doublée soit elle est perdue à jamais !` },
            )

        let pages = [
            help1,
            help2
        ];

        let emojis = [
            '⬅️',
            '➡️'
        ];

        paginationEmbed(message, pages, emojis, 60000);
    },
};