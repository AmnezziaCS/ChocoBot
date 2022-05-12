const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hocoball')
        .setDescription('Une question, demandez à la boule magique.'),
    aliases: ['ball'],
    execute(client, message, args) {

        if (!message.content.includes('?')) {
            const chocoballExplanationsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle('ChocoBall')
                .setDescription("La ChocoBall magique vous permez d'avoir la réponse magique à votre question <:YEP:800841093515444244>")
                .addFields(
                    { name: '`c!hocoBall / ball [question ?]`', value: "Donnera la réponse à votre question, n'oubliez pas le point d'interrogation !" },
                )
            return message.channel.send({ embeds: [chocoballExplanationsEmbed] });
        }

        switch (getRandomInt(9)) {
            case 0:
                return message.channel.send('Re-demandez plus tard <:pepoG:948676211213758474>');
            case 1:
                return message.channel.send('Certainement <:Thonk:665296573294706749>');
            case 2:
                return message.channel.send('Absolument <:D_:842898126645362758> !!!');
            case 3:
                return message.channel.send("Je n'en suis pas certain <:hmmmm:898672241787674634>");
            case 4:
                return message.channel.send('Pas du tout <a:NOPERS:804801139702628392>');
            case 5:
                return message.channel.send('Je ne me prononcerais pas <:YEP:800841093515444244>');
            case 6:
                return message.channel.send('Concentrez vous et re-demandez <:pepoG:948676211213758474>');
            case 7:
                return message.channel.send('Oui <a:NODDERS:804418094625718362>');
            case 8:
                return message.channel.send('Non <a:NOPERS:804801139702628392>');
        }


    },
};