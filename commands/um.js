const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('um')
        .setDescription('OULAAA'),
    execute(client, message, args) {
        message.react(`😳`);
        message.react(`🍆`);
        message.react(`👌`);
        message.react(`💦`);
    },
};