const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meilleurmove')
        .setDescription('Le meilleurrrrr move !'),
    execute(client, message, args) {
        message.channel.send({
            files: [{
                attachment: './meilleurmove.mp4',
                name: 'meilleurmove.mp4'
            }]
        })
    },
};