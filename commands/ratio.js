const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ratio')
        .setDescription('Ratio la personne mentionnée !'),
    execute(client, message, args) {

        if (!message.mentions.users.first()) {
            return message.channel.send("Je te ratio toi car tu n'as mentionné personne <:hmmmm:898672241787674634>").then(sentEmbed => {
                sentEmbed.react("<:Upvote:724968272218423296>");
            });
        }

        const target = message.mentions.users.first();

        if (!target) {
            return message.channel.send("La mention n'est pas valable <:Sadge:804417924675797042>, choisissez une mention valable pour que la commande marche.");
        }

        if (message.author === target) {
            return message.channel.send(`Tu veux te ratio toi même <:Thonk:665296573294706749>, bizarre.`);
        }

        if (args[0] === "<@893457417675886602>") {
            return message.channel.send(`Tu crois vraiment que tu peux me ratio <:Peepoclown:724968518797361164>`);
        }

        return message.channel.send(`Je ratio ${target} <:YEP:800841093515444244>`).then(sentEmbed => {
            sentEmbed.react("<:Upvote:724968272218423296>");
        });




    },
};