const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription(`Cette commande permet de bet une somme d'argent avec une chance de la doubler ou la perdre !`),
    async execute(client, message, args, profileData) {
        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        const betValue = args[0];

        if (profileData.chococoins != 0) {
            if (!parseInt(betValue)) {
                const betExplanationsEmbed = new MessageEmbed()
                    .setColor('#F8F70E')
                    .setTitle(`Bet`)
                    .setDescription("La commande bet vous permet de miser une somme d'argent pour espérer en récupérer le double. ceci dit, faites attention à ne pas perdre votre mise !")
                    .setFields(
                        { name: '`c!bet [valeur en ChocoCoins]`', value: "Si votre solde de ChocoCoins est insuffisant par rapport à votre mise, vous ne pourrez effectuer la commande !" },
                    )
                return message.channel.send({ embeds: [betExplanationsEmbed] });
            } else {
                if (betValue >= 0) {
                    if (profileData.chococoins >= betValue) {
                        if (getRandomInt(2) === 0) {
                            const balanceUodate = await ProfileModel.findOneAndUpdate({
                                userID: message.author.id,
                            },
                                {
                                    $inc: {
                                        chococoins: betValue,
                                    }
                                });
                            const accountIncreasedByBetEmbed = new MessageEmbed()
                                .setColor('#F8F70E')
                                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                                .setTitle(`Bravo, vous avez gagné !`)
                                .setFields(
                                    { name: `Votre compte à été crédité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins + parseInt(betValue)} ©` },
                                )
                            message.channel.send({ embeds: [accountIncreasedByBetEmbed] });
                        } else {
                            const balanceUpdate = await ProfileModel.findOneAndUpdate({
                                userID: message.author.id,
                            },
                                {
                                    $inc: {
                                        chococoins: - betValue,
                                    }
                                });
                            const accountDecreasedByBetEmbed = new MessageEmbed()
                                .setColor('#F8F70E')
                                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
                                .setTitle(`Nonnn, vous avez perdu !`)
                                .setFields(
                                    { name: `Votre compte à été décrédité de ${betValue} ChocoCoins, votre nouveau montant de ChocoCoins est : `, value: `${profileData.chococoins - parseInt(betValue)} ©` },
                                )
                            message.channel.send({ embeds: [accountDecreasedByBetEmbed] });
                        }
                    } else {
                        const notEnoughCoinsEmbed = new MessageEmbed()
                            .setColor('#F8F70E')
                            .setTitle(`Votre solde de ChocoCoins est insuffisant`)
                            .setFields(
                                { name: `Votre avez bet ${betValue} ChocoCoins alors que vous n'en possédez que: `, value: `${profileData.chococoins} ©` },
                            )
                        return message.channel.send({ embeds: [notEnoughCoinsEmbed] });
                    }
                } else {
                    const negativeBetEmbed = new MessageEmbed()
                        .setColor('#F8F70E')
                        .setTitle(`Vous avez voulu bet une valeur négative de chococoins <:Madge:836688670316691486>`)
                        .setDescription(`Veuillez donner une valeur positive si vous souhaitez bet !`)
                    return message.channel.send({ embeds: [negativeBetEmbed] });
                }
            }
        } else {
            const zeroCoinsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`Votre solde de ChocoCoins est insuffisant, vous avez 0 ©`)
            return message.channel.send({ embeds: [zeroCoinsEmbed] });
        }

    },
};