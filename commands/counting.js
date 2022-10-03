const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ServerModel = require('../models/serverSchema');

const helpEmbed = (message) => {
    const helpEmbed = new MessageEmbed()
        .setColor('#F8F70E')
        .setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`)
        .setTitle(`Counting`)
        .setDescription("La commande counting vous permet de compter dans l'ordre croissant, ceci dit, si vous faites une erreur, la chaîne se cassera et il faudra recommencer. !")
        .setFields(
            { name: "`c!counting / count [help] [lb]`", value: "Le leaderboard global des records inter-serveurs est disponible en ajoutant [lb] après la commande !" },
        )
    return message.channel.send({ embeds: [helpEmbed] });
}

const lbEmbed =  async (message, client) => {
    const sortTabByRecordAsc = (all) => {
        let tab = new Array();
        all.forEach(element => {
            const pair = {};
            let myPair = Object.create(pair);
            pair.id = element.serverID;
            pair.record = element.countingRecord;
            tab.push(pair);
        });
    
        tab.sort((a, b) => parseFloat(b.coins) - parseFloat(a.coins));
        return tab;
    }

    serverData = await ServerModel.findOne({ serverID: message.guild.id });
    if (!serverData) {
        let serverProfile = await ServerModel.create({
            serverID: message.guild.id,
            countingRecord: 0
        });
        serverProfile.save();
    }

    const allValuesOfDB = await ServerModel.find();
    const sortedTab = sortTabByRecordAsc(allValuesOfDB);
    let authorServerString = '';

    const authorServerRank = sortedTab.findIndex(object => {
        return object.id === message.guild.id;
    });

    if (authorServerRank > 9) {
        authorServerString = `\n\n ${authorServerRank + 1} - # ${message.guild.name} => ${serverData.countingRecord}`;
    }

    const fetchServer = async (sortedTab, i) => client.guilds.fetch(sortedTab[i].id);
    fillTab = new Array();
    forSize = sortedTab.length <= 10 ? sortedTab.length : 10;
    for (i = 0; i < forSize; i++) {
        fillTab.push(await fetchServer(sortedTab, i));
    }

    lbString = `\`\`\` `
    for (i = 0; i < forSize; i++) {
        stringIfNotFirst = i === 0 ? `` : `\n\n `;
        lbString += `${stringIfNotFirst}${i + 1} # ${fillTab[i].name} => ${sortedTab[0].record}`;
    }
    lbString += `${authorServerString}\`\`\``;

    const leaderboardEmbed = new MessageEmbed()
        .setColor('#F8F70E')
        .setAuthor({ name: `Leaderboard Global du counting:`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
        .setDescription(lbString)
    return message.channel.send({ embeds: [leaderboardEmbed] });
}

const countingStartsEmbed = (message) => {
    const countingStartsEmbed = new MessageEmbed()
        .setColor('#F8F70E')    
        .setTitle(`L'événement de comptage à commencé !`)
        .setDescription("Il vous faut maintenant compter de 1 en 1 sans faire d'erreurs pour peut être battre le record du serveur !")
        .setFields(
            { name: "Pour plus d'infos", value: "`c!counting / count help`" },
        )
    return message.channel.send({ embeds: [countingStartsEmbed] });
}

const countingEndsEmbed = (message, serverCountingRecord) => {
    const countingStartsEmbed = new MessageEmbed()
        .setColor('#F8F70E')    
        .setTitle(`L'événement de comptage est maintenant terminé !`)
        .setDescription(`La chaîne a été cassée par une erreur ou par manque de temps <:agony:918124977352499200> !`)
        .setFields({
            name: "Le record du serveur est :", value: `${serverCountingRecord}`},
        )
    return message.channel.send({ embeds: [countingStartsEmbed] }); 
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counting')
        .setDescription(`Lance une chaîne de counting.`),
    aliases: ['count'],
    async execute(client, message, args) {
        if (args[0] === "help") {
            return helpEmbed(message);
        }
        if (args[0] === "lb") {
            return lbEmbed(message, client);
        }

        serverData = await ServerModel.findOne({ serverID: message.guild.id });
        if (!serverData) {
            let serverProfile = await ServerModel.create({
                serverID: message.guild.id,
                countingRecord: 0
            });
            serverProfile.save();
        }

        countingStartsEmbed(message);
        let currentCount = 1;

        const colletorFilter = message => !message.author.bot;
        const collector = message.channel.createMessageCollector({filter: colletorFilter, time: 60000});
        collector.on('collect', (countMessage) => {
            if (!Number.isInteger(parseInt(countMessage))) return;
            countResult = Math.floor(eval(countMessage.content.replace(/\s+/g, '')));
            if (countResult != currentCount) {
                countMessage.react("❌")
                message.channel.send("> La chaîne a été cassée <:Sadge:920699839182954526>");
                return collector.stop();
            }
            collector.resetTimer();
            currentCount += 1;
            if (!serverData) return countMessage.react("☑");
            if (serverData.countingRecord < currentCount) return countMessage.react("☑");
            return countMessage.react("✅")
        })
        collector.on('end', async () => {
            if (!serverData) { 
                const recordUpdate = await ServerModel.findOneAndUpdate({
                    serverID: message.guild.id,
                },
                    {
                        $set: {
                            countingRecord: currentCount - 1,
                        }
                    });
                return countingEndsEmbed(message, currentCount - 1);
            }
            if (serverData.countingRecord >= currentCount - 1) return countingEndsEmbed(message, serverData.countingRecord);

            const recordUpdate = await ServerModel.findOneAndUpdate({
                serverID: message.guild.id,
            },
                {
                    $set: {
                        countingRecord: currentCount - 1,
                    }
                });
            countingEndsEmbed(message, currentCount - 1);
            
        })
    }
}