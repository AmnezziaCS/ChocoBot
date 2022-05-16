const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
const getUser = require('../osuApi/getUser');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('osulink')
        .setDescription('Links your osu id to your discord profile'),
    async execute(client, message, args, profileData) {

        let userFalse = false;
        const osuID = args[0];

        // Checks if command is valid

        if (!parseInt(osuID)) {
            const osuLinkExplanationsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`OsuLink`)
                .setDescription("La commande osuLink vous permet de lier votre comtpe discord à votre ID de joueur osu trouvable sur votre profil.")
                .setFields(
                    { name: '`c!osuLink [ID de joueur osu]`', value: "Un ID incorrect ne sera pas pris en compte !" },
                )
            return message.channel.send({ embeds: [osuLinkExplanationsEmbed] });
        }

        const user = await getUser(osuID);

        // Checks if user exists

        if (user === null) {
            const wrongIDEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Votre ID ${osuID} n'est pas valable, merci de choisir un ID correct !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [wrongIDEmbed] });
        }

        // Creates embed

        const osuLinkUpdate = await ProfileModel.findOneAndUpdate({
            userID: message.author.id,
        },
            {
                $set: {
                    osuUserID: osuID,
                }
            });
        const osuLinkFinalEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: `Le compte osu ${user.username} a bien été lié à votre Discord !`, iconURL: `${user.avatar_url}.jpeg` })
        return message.channel.send({ embeds: [osuLinkFinalEmbed] });
    },
};