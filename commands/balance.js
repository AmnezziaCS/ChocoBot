const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription(`Renvoie la monaie du joueur.`),
    aliases: ['bl', 'bal', 'b'],
    async execute(client, message, args, profileData) {
        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        const target = message.mentions.users.first();
        if (target != null) {
            if (target.bot) {
                const botTargetEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande sur les bots !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                return message.channel.send({ embeds: [botTargetEmbed] });
            } else {
                targetProfileData = await ProfileModel.findOne({ userID: target.id });
                if (!targetProfileData) {
                    let profile = await ProfileModel.create({
                        userID: message.mentions.users.first().id,
                        serverID: message.guild.id,
                        chococoins: 5000,
                        dailyCheck: '2020-04-24T19:44:31.589+0000'
                    });
                    profile.save();

                    const profileCreatedEmbed = new MessageEmbed()
                        .setColor('#F8F70E')
                        .setAuthor({ name: `Le profil de la personne mentionnée a été crée`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                    return message.channel.send({ embeds: [profileCreatedEmbed] });
                } else {
                    const targetBalanceEmbed = new MessageEmbed()
                        .setColor('#F8F70E')
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`)
                        .setTitle(`Les thunasses de ${target.username}`)
                        .setFields(
                            { name: `Montant de ChocoCoins : `, value: `${targetProfileData.chococoins} ©` },
                        )
                    return message.channel.send({ embeds: [targetBalanceEmbed] });
                }
            }
        }
        const authorBalanceEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
            .setTitle(`Les thunasses de ${message.author.username}`)
            .setFields(
                { name: `Montant de ChocoCoins : `, value: `${profileData.chococoins} ©` },
            )
        return message.channel.send({ embeds: [authorBalanceEmbed] });
    },
};
