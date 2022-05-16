const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Permet de récupérer des ChocoCoins chaque jour'),
    aliases: ['d'],
    async execute(client, message, args, profileData) {

        // checks if message author has a coins profile

        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        // checks if message author's daily is available 

        const differenceInDays = (new Date().getTime() - profileData.dailyCheck.getTime()) / 86400000;

        if (!(profileData.dailyCheck === null || differenceInDays > 1)) {
            var timeLeft = new Date(profileData.dailyCheck);
            timeLeft.setDate(timeLeft.getDate() + 1);

            const dailyFailedEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                .setTitle(`Votre daily n'est pas disponible ${message.author.username}`)
                .setFields(
                    { name: `Vous pourrez utiliser votre daily :`, value: `<t:${Math.round(timeLeft.getTime() / 1000)}:R>` },
                )
            return message.channel.send({ embeds: [dailyFailedEmbed] });
        }

        // If daily available, you get your money

        const balanceUpdate = await ProfileModel.findOneAndUpdate({
            userID: message.author.id,
        },
            {
                $inc: {
                    chococoins: 2000,
                }
            });

        const dateUpdate = await ProfileModel.findOneAndUpdate({
            userID: message.author.id,
        },
            {
                $set: {
                    dailyCheck: new Date(),
                }
            });

        const dailySuccessfullEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
            .setTitle(`Votre compte à bien été crédité de 2000 ChocoCoins`)
            .setFields(
                { name: `Nouveau montant de ChocoCoins : `, value: `${profileData.chococoins + 2000} ©` },
            )
        return message.channel.send({ embeds: [dailySuccessfullEmbed] });

    },
};