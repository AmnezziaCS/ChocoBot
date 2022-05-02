const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ounterratio')
        .setDescription('Permet de soutenir qqun dans son contre ratio'),
    execute(client, message, args) {
        return message.channel.send(`Je soutiens ${message.author.username} dans son contre ratio <:Madge:836688670316691486>`).then(sentEmbed => {
            sentEmbed.react("<:Upvote:724968272218423296>");
        });
    },
};