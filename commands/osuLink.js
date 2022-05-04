const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
const axios = require('axios');
const getToken = require('./osuApi/getToken');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osulink')
        .setDescription('Links your osu id'),
    async execute(client, message, args, profileData) {

        let userFalse = false;
        const osuID = args[0];

        if (parseInt(osuID)) {

            const token = await getToken();

            const auth = {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

            const getUserFromID = await axios.get(
                `${process.env.OSU_API_URL}/users/${osuID}`,
                auth
            ).catch((error) => {
                userFalse = true;
                console.log('Wrong ID or Problem with the osu API request')
            });

            if (userFalse) {
                const wrongIDEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setAuthor({ name: `Votre ID ${osuID} n'est pas valable, merci de choisir un ID correct !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                return message.channel.send({ embeds: [wrongIDEmbed] });

            } else {
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
                    .setAuthor({ name: `Le compte osu ${getUserFromID.data.username} a bien été lié à votre Discord !`, iconURL: `${getUserFromID.data.avatar_url}.jpeg` })
                return message.channel.send({ embeds: [osuLinkFinalEmbed] });
            }

        } else {
            const osuLinkExplanationsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`OsuLink`)
                .setDescription("La commande osuLink vous permet de lier votre comtpe discord à votre ID de joueur osu trouvable sur votre profil.")
                .setFields(
                    { name: '`c!osuLink [ID de joueur osu]`', value: "Un ID incorrect ne sera pas pris en compte !" },
                )
            return message.channel.send({ embeds: [osuLinkExplanationsEmbed] });
        }
    },
};