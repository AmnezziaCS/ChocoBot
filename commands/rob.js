const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription("Une commande qui vous permet de voler de l'argent à quelqu'un !"),
    async execute(client, message, args, profileData) {

        const updateAuthorChocoCoins = async (value) => {
            const balanceUpdate = await ProfileModel.findOneAndUpdate({
                userID: message.author.id,
            },
                {
                    $inc: {
                        chococoins: value,
                    }
                });
        }

        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        const target = message.mentions.users.first();
        if (target != null) {

            if (target === message.author) {
                const selfRobEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setAuthor({ name: `Vous ne pouvez pas vous rob vous même !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                    .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                return message.channel.send({ embeds: [selfRobEmbed] });
            }

            if (target.bot) {
                const botTargetEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande sur les bots !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                    .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                return message.channel.send({ embeds: [botTargetEmbed] });
            }

            targetProfileData = await ProfileModel.findOne({ userID: target.id });
            if (!targetProfileData) {
                let profile = await ProfileModel.create({
                    userID: target.id,
                    serverID: message.guild.id,
                    chococoins: 5000,
                    dailyCheck: '2020-04-24T19:44:31.589+0000'
                });
                profile.save();
            }

            if (profileData.chococoins >= 1000 && targetProfileData.chococoins >= 1000) {
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                const rollNumber = getRandomInt(5);
                const small = 100;
                const big = 1000;
                switch (rollNumber) {
                    case 0: case 1:
                        updateAuthorChocoCoins(-small);
                        targetProfileData = await ProfileModel.findOneAndUpdate({
                            userID: target.id,
                        },
                            {
                                $inc: {
                                    chococoins: small,
                                }
                            });
                        const smallLossEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                            .setTitle(`En essayant de voler ${target.username}, vous vous êtes pris un mur et avez perdu ${small} © !`)
                            .setFields(
                                { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins - small} ©` },
                            )
                            .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                        return message.channel.send({ embeds: [smallLossEmbed] });
                    case 2:
                        updateAuthorChocoCoins(-big);
                        targetProfileData = await ProfileModel.findOneAndUpdate({
                            userID: target.id,
                        },
                            {
                                $inc: {
                                    chococoins: big,
                                }
                            });
                        const bigLossEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                            .setTitle(`En essayant de voler ${target.username}, vous vous êtes fait arrêter et avez du lui donner ${big} © !`)
                            .setFields(
                                { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins - big} ©` },
                            )
                            .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                        return message.channel.send({ embeds: [bigLossEmbed] });
                    case 3:
                        updateAuthorChocoCoins(small);
                        targetProfileData = await ProfileModel.findOneAndUpdate({
                            userID: target.id,
                        },
                            {
                                $inc: {
                                    chococoins: -small,
                                }
                            });
                        const smallGainEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                            .setTitle(`Vous avez réussi à voler ${target.username}, vous lui avez fait les poches et récupérez ${small} © !`)
                            .setFields(
                                { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins + small} ©` },
                            )
                            .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                        return message.channel.send({ embeds: [smallGainEmbed] });
                    case 4:
                        updateAuthorChocoCoins(big);
                        targetProfileData = await ProfileModel.findOneAndUpdate({
                            userID: target.id,
                        },
                            {
                                $inc: {
                                    chococoins: -big,
                                }
                            });
                        const bigGainEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                            .setTitle(`Vous avez réussi à voler ${target.username}, vous repartez avec sa carte de crédit qui contenanit ${big} © !`)
                            .setFields(
                                { name: `Votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins + big} ©` },
                            )
                            .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                        return message.channel.send({ embeds: [bigGainEmbed] });
                }

            } else {
                const newEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setAuthor({ name: `Vous ou la personne que vous avez essayé de rob posséde moins de 1000 ChocoCoins, par conséquent, vous ne pouvez utiliser la commande !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                    .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
                return message.channel.send({ embeds: [newEmbed] });
            }
        } else {
            const newEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`Rob`)
                .setDescription("La commande rob vous permet de voler des ChocoCoins à la personne mentionnée. Ceci dit, garre à ne pas vous faire prendre ou vous le regretterez !")
                .setFields(
                    { name: '`!c rob [mention de la personne à voler]`', value: "Attention, vous devez avoir un solde de ChocoCoins au moins supérieur à 1000 pour pouvoir rob un utilisateur !" },
                )
                .setFooter({ text: `Merci d'utiliser ChocoBot, ~Chocooo`, iconURL: 'https://static.wikia.nocookie.net/smashbros/images/1/10/Art_Chocobo_FFF-CT.png/revision/latest/scale-to-width-down/190?cb=20201221211852&path-prefix=fr' })
            return message.channel.send({ embeds: [newEmbed] });
        }

    },
};