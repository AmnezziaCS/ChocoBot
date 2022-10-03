const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const updateAuthorChocoCoins = async (value, message) => {
    const balanceUpdate = await ProfileModel.findOneAndUpdate({
        userID: message.author.id,
    },
        {
            $inc: {
                chococoins: value,
            }
        });
}

const updateTargetChocoCoins = async (value, targetProfileData, target) => {
    targetProfileData = await ProfileModel.findOneAndUpdate({
        userID: target.id,
    },
        {
            $inc: {
                chococoins: value,
            }
        });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription("Une commande qui vous permet de voler de l'argent à quelqu'un !"),
    async execute(client, message, args, profileData) {

        // checks if the message author has a coin profile

        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        const target = message.mentions.users.first();
        if (!target) {
            const errorEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`Rob`)
                .setDescription("La commande rob vous permet de voler des ChocoCoins à la personne mentionnée. Ceci dit, garre à ne pas vous faire prendre ou vous le regretterez !")
                .setFields(
                    { name: '`c!rob [mention de la personne à voler]`', value: "Attention, vous devez avoir un solde de ChocoCoins au moins supérieur à 1000 pour pouvoir rob un utilisateur !" },
                )
            return message.channel.send({ embeds: [errorEmbed] });
        }

        if (target === message.author) {
            const selfRobEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ne pouvez pas vous rob vous même !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [selfRobEmbed] });
        }

        if (target.bot) {
            const botTargetEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande sur les bots !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [botTargetEmbed] });
        }

        // checks if the pinged person has a coin profile, if not, creates one

        targetProfileData = await ProfileModel.findOne({ userID: target.id });
        if (!targetProfileData) {
            let profile = await ProfileModel.create({
                userID: target.id,
                serverID: message.guild.id,
                chococoins: 5000,
                dailyCheck: '2020-04-24T19:44:31.589+0000'
            });
            profile.save();

            const profileCreatedEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Le profil de la personne mentionnée a été créé`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [profileCreatedEmbed] });
        }

        if (profileData.chococoins < 1000 || targetProfileData.chococoins < 1000) {
            const notEnoughMoneyEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ou la personne que vous avez essayé de rob posséde moins de 1000 ChocoCoins, par conséquent, vous ne pouvez utiliser cette commande !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [notEnoughMoneyEmbed] });
        }

        const small = 100;
        const big = 500;
        switch (getRandomInt(5)) {
            case 0: case 1:
                updateAuthorChocoCoins(-small, message);
                updateTargetChocoCoins(small, targetProfileData, target);
                const smallLossEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                    .setTitle(`En essayant de voler ${target.username}, vous vous êtes pris un mur et avez perdu ${small} © !`)
                    .setFields(
                        { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins - small} ©` },
                    )
                return message.channel.send({ embeds: [smallLossEmbed] });
            case 2:
                updateAuthorChocoCoins(-big, message);
                updateTargetChocoCoins(big, targetProfileData, target);
                const bigLossEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                    .setTitle(`En essayant de voler ${target.username}, vous vous êtes fait arrêter et avez du lui donner ${big} © !`)
                    .setFields(
                        { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins - big} ©` },
                    )
                return message.channel.send({ embeds: [bigLossEmbed] });
            case 3:
                updateAuthorChocoCoins(small, message);
                updateTargetChocoCoins(-small, targetProfileData, target);
                const smallGainEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                    .setTitle(`Vous avez réussi à voler ${target.username}, vous lui avez fait les poches et récupérez ${small} © !`)
                    .setFields(
                        { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins + small} ©` },
                    )
                return message.channel.send({ embeds: [smallGainEmbed] });
            case 4:
                updateAuthorChocoCoins(big, message);
                updateTargetChocoCoins(-big, targetProfileData, target);
                const bigGainEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                    .setTitle(`Vous avez réussi à voler ${target.username}, vous repartez avec sa carte de crédit qui contenait ${big} © !`)
                    .setFields(
                        { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins + big} ©` },
                    )
                return message.channel.send({ embeds: [bigGainEmbed] });
        }
    },
};