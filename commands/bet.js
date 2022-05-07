const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription(`Cette commande permet de bet une somme d'argent avec une chance de la doubler ou la perdre !`),
    async execute(client, message, args, profileData) {

        // checks if the message author has a money profile, if not creates one.

        profileData = await ProfileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            return;
        }

        // checks if the command is right c!bet [coins value]

        const [betValue] = args;

        if (!parseInt(betValue)) {
            const betExplanationsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setTitle(`Bet`)
                .setDescription("La commande bet vous permet de miser une somme d'argent pour espérer en récupérer le double. ceci dit, faites attention à ne pas perdre votre mise !")
                .setFields(
                    { name: '`c!bet [valeur en ChocoCoins]`', value: "Si votre solde de ChocoCoins est insuffisant par rapport à votre mise, vous ne pourrez effectuer la commande !" },
                )
            return message.channel.send({ embeds: [betExplanationsEmbed] });
        }

        // checks if the message author has more than 0 coins

        if (profileData.chococoins <= 0) {
            const zeroCoinsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: "Votre solde de ChocoCoins est insuffisant, vous avez 0 ©", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [zeroCoinsEmbed] });
        }

        // checks if the value of the bet is superior/equal to 0

        if (betValue <= 0) {
            const negativeBetEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: "Vous avez voulu bet une valeur négative de chococoins !", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                .setDescription(`Veuillez donner une valeur positive si vous souhaitez bet !`)
            return message.channel.send({ embeds: [negativeBetEmbed] });
        }

        // checks if message author has more or same ammount of coins than what he bet

        if (profileData.chococoins < betValue) {
            const notEnoughCoinsEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: "Votre solde de ChocoCoins est insuffisant", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                .setFields(
                    { name: `Votre avez bet ${betValue} ChocoCoins alors que vous n'en possédez que: `, value: `${profileData.chococoins} ©` },
                )
            return message.channel.send({ embeds: [notEnoughCoinsEmbed] });
        }

        // message author either wins or loses coins according to a random value

        switch (getRandomInt(2)) {
            case 0:
                balanceUpdate = await ProfileModel.findOneAndUpdate({
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
                return message.channel.send({ embeds: [accountIncreasedByBetEmbed] });
            case 1:
                balanceUpdate = await ProfileModel.findOneAndUpdate({
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
                return message.channel.send({ embeds: [accountDecreasedByBetEmbed] });
        }
    },
};