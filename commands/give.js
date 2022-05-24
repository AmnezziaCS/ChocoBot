const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collector } = require('discord.js');
const ProfileModel = require('../models/profileSchema');

const errorEmbed = (message) => {
    const errorEmbed = new MessageEmbed()
        .setColor('#F8F70E')
        .setTitle(`Give`)
        .setDescription("La commande give vous permet de donner ou retirer des chcococoins à un user !")
        .setFields(
            { name: "`c!give [valeur en ChocoCoins] [tag de l'utilisateur ciblé]`", value: "En cas de problèmes, la commande ne s'éxecutera pas !" },
        )
    return message.channel.send({ embeds: [errorEmbed] });
}

const editedFinalEmbed = (message) => {
    const editedFinalEmbed = new MessageEmbed()
        .setColor('#F8F70E')
        .setAuthor({ name: `Vous n'avez rien choisi !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
    return editedFinalEmbed;
}

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
        let embedEdited = false;
        const [moneyAmount] = args;

        // checks if message author is bot admin 

        if (message.author.id != process.env.AMNEZZIA_ID) {
            const permissionsWrongEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [permissionsWrongEmbed] });
        }

        // checks if command provided amount value is correct and if someone was pinged  

        const target = message.mentions.users.first();

        if (!parseInt(moneyAmount) || !target) {
            return errorEmbed(message);
        }

        // checks if pinged person's a bot 

        if (target.bot) {
            const botTargetEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous ne pouvez pas utiliser cette commande sur les bots !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [botTargetEmbed] });
        }

        // checks if pinged person has a money profile, if not creates one

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

        // creation of our eventListener / reaction collector 

        const chooseAddOrRemoveEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: `Choisissez si vous voulez lui ajouter ou lui retirer cette somme !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            .setDescription(`${stonksEmoji} = Add ${moneyAmount} ChocoCoins to ${target}'s account ? \n\n${notStoksEmoji} = Remove ${moneyAmount} ChocoCoins from ${target}'s account ?`)
        let collectedEmbed = await message.channel.send({ embeds: [chooseAddOrRemoveEmbed] });

        for (const emoji of emojiList) await collectedEmbed.react(emoji);
        const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
        const reactionCollector = collectedEmbed.createReactionCollector({ filter, time: 60000 });
        reactionCollector.on('collect', async (reaction, user) => {
            if (user.id != message.author.id) return reaction.users.remove(user);

            reaction.users.remove(message.author);

            // we either choose to increase or decrease the amount of coins

            switch (reaction.emoji.name) {
                case emojiList[0]:
                    await collectedEmbed.reactions.removeAll();
                    balanceUpdate = await ProfileModel.findOneAndUpdate({
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
                    embedEdited = true;
                    return reactionCollector.stop();
                case emojiList[1]:
                    await collectedEmbed.reactions.removeAll();
                    balanceUpdate = await ProfileModel.findOneAndUpdate({
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
                        .setTitle(`Le compte de ${target.username} à bien été débité de ${moneyAmount} ChocoCoins`)
                        .setFields(
                            { name: `Nouveau montant de ChocoCoins : `, value: `${balanceUpdate.chococoins - parseInt(moneyAmount)} ©` },
                        )
                    collectedEmbed.edit({ embeds: [coinsDecreasedEmbed] });
                    embedEdited = true;
                    return reactionCollector.stop();
            }
        });
        reactionCollector.on('end', () => {
            if (embedEdited === false) {
                collectedEmbed.reactions.removeAll();
                return collectedEmbed.edit({ embeds: [editedFinalEmbed(message)] });
            }
        });
    }
}