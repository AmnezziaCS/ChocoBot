const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collector } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Permet de give des chococoins (ADMIN COMMAND)'),
    async execute(client, message, args, profileData) {

        const stonksEmoji = '📈';
        const notStoksEmoji = '📉';
        const emojiList = [
            stonksEmoji,
            notStoksEmoji
        ];
        const moneyAmount = args[0];
        let messageEdited = false;

        const errorEmbed = () => {
            const errorEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`Give`)
                .setDescription("La commande give vous permet de donner ou retirer des chcococoins à un user !")
                .setFields(
                    { name: "`c!give [valeur en ChocoCoins] [tag de l'utilisateur ciblé]`", value: "En cas de problèmes, la commande ne s'éxecutera pas !" },
                )
            return message.channel.send({ embeds: [errorEmbed] });
        }

        const editedFinalEmbed = () => {
            const editedFinalEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous n'avez rien choisi !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return editedFinalEmbed;
        }

        if (message.author.id != process.env.AMNEZZIA_ID) {
            const permissionsWrongEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [permissionsWrongEmbed] });
        } else {
            if (!parseInt(moneyAmount)) {
                return errorEmbed();
            } else {
                const target = message.mentions.users.first();
                if (!target) {
                    return errorEmbed();
                } else {
                    if (target.bot) {
                        const botTargetEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande sur les bots !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                        return message.channel.send({ embeds: [botTargetEmbed] });
                    } else {
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
                                .setAuthor({ name: `Le profil de la personne mentionnée a été crée`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                            return message.channel.send({ embeds: [profileCreatedEmbed] });
                        }

                        const chooseAddOrRemoveEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setAuthor({ name: `Choisissez si vous voulez lui ajouter ou lui retirer cette somme !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                            .setDescription(`${stonksEmoji} = Add ${moneyAmount} ChocoCoins to ${target}'s account ? \n\n${notStoksEmoji} = Remove ${moneyAmount} ChocoCoins from ${target}'s account ?`)
                        let collectedEmbed = await message.channel.send({ embeds: [chooseAddOrRemoveEmbed] });

                        for (const emoji of emojiList) await collectedEmbed.react(emoji);
                        const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
                        const reactionCollector = collectedEmbed.createReactionCollector({ filter, time: 60000 });
                        reactionCollector.on('collect', async (reaction, user) => {
                            if (user.id === message.author.id) {
                                reaction.users.remove(message.author);
                                if (reaction.emoji.name === emojiList[0]) {
                                    await collectedEmbed.reactions.removeAll();
                                    const balanceUpdate = await ProfileModel.findOneAndUpdate({
                                        userID: target.id,
                                    },
                                        {
                                            $inc: {
                                                chococoins: moneyAmount,
                                            }
                                        });
                                    const coinsIncreasedEmbed = new MessageEmbed()
                                        .setColor('#F8F70E')
                                        .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`)
                                        .setTitle(`Le compte de ${target.username} à bien été crédité de ${moneyAmount} ChocoCoins`)
                                        .setFields(
                                            { name: `Nouveau montant de ChocoCoins : `, value: `${balanceUpdate.chococoins + parseInt(moneyAmount)} ©` },
                                        )
                                    collectedEmbed.edit({ embeds: [coinsIncreasedEmbed] });
                                    messageEdited = true;
                                    return reactionCollector.stop();
                                }
                                else if (reaction.emoji.name === emojiList[1]) {
                                    await collectedEmbed.reactions.removeAll();
                                    const balanceUpdate = await ProfileModel.findOneAndUpdate({
                                        userID: target.id,
                                    },
                                        {
                                            $inc: {
                                                chococoins: - moneyAmount,
                                            }
                                        });
                                    const coinsDecreasedEmbed = new MessageEmbed()
                                        .setColor('#F8F70E')
                                        .setThumbnail(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.jpeg`)
                                        .setTitle(`Le compte de ${target.username} à bien été décrédité de ${moneyAmount} ChocoCoins`)
                                        .setFields(
                                            { name: `Nouveau montant de ChocoCoins : `, value: `${balanceUpdate.chococoins - parseInt(moneyAmount)} ©` },
                                        )
                                    collectedEmbed.edit({ embeds: [coinsDecreasedEmbed] });
                                    messageEdited = true;
                                    return reactionCollector.stop();

                                }
                            } else {
                                reaction.users.remove(user);
                            }
                        });
                        reactionCollector.on('end', () => {
                            if (messageEdited === false) {
                                collectedEmbed.reactions.removeAll();
                                return collectedEmbed.edit({ embeds: [editedFinalEmbed()] });
                            }
                        });
                    }
                }
            }
        }
    }
}