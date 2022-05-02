const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hocobo')
        .setDescription('Chocobo !'),
    execute(client, message, args) {
        return message.channel.send('https://tenor.com/view/alpha-ffxiv-chocobo-alphabestboi-gif-19909966');
    },
};