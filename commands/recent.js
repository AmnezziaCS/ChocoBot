const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
const getUserRecentScore = require('../osuApi/getUserRecentScore');

function getValue(obj, key) {
    return obj[key];
}

function msToTime(duration) {
    seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + "h" + minutes + "m" + seconds + "s";
}

const rankTab = {
    XH: '<:XH:971030365772845156>',
    X: '<:X_:971030365839970304>',
    SH: '<:SH:971030365810610226>',
    S: '<:S:971030365726711839>',
    A: '<:A_:971030365705732106>',
    B: '<:B:971030365793820672>',
    C: '<:C:971030365613457478>',
    D: '<:D:971030365684793354>'
}

const voyelTab = [
    'a',
    'e',
    'i',
    'o',
    'u',
    'y'
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent')
        .setDescription('Recent your last osu play !'),
    aliases: ['r', 'rs'],
    async execute(client, message, args, profileData) {

        // Checks if the message author is linked to an osu account 

        const noOsuAccountEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: "Vous n'avez pas lié de compte osu à votre Discord", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            .setDescription("Veuillez utiliser la commande `c!osulink [id osu]` afin de lier votre compte")
        const osuIDExists = await ProfileModel.findOne({ userID: message.author.id }).select("osuUserID").lean();
        if (osuIDExists.osuUserID === '' || osuIDExists.osuUserID == null) return message.channel.send({ embeds: [noOsuAccountEmbed] });

        const userRecentScore = await getUserRecentScore(1, profileData.osuUserID);

        if (!userRecentScore) {
            const noScoresEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous n'avez pas de scores récents !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [noScoresEmbed] });
        }

        let ppAmount = '`null`';
        if (userRecentScore.pp) ppAmount = userRecentScore.pp.toPrecision(4);

        const modsBuffer = userRecentScore.mods.join('') || 'Nomod';

        let voyelBuffer = "de ";
        voyelTab.forEach(element => {
            if (userRecentScore.user.username[0].toLowerCase().includes(element)) {
                return voyelBuffer = "d'";
            }
        })

        const recentScoreEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: `Le score le plus récent ${voyelBuffer}${userRecentScore.user.username} !`, iconURL: `${userRecentScore.user.avatar_url}.jpeg` })
            .setTitle(`${userRecentScore.beatmapset.title} [${userRecentScore.beatmap.version}] - ${userRecentScore.beatmap.difficulty_rating}*`)
            .setURL(`${userRecentScore.beatmap.url}`)
            .setDescription(`${getValue(rankTab, userRecentScore.rank)} **(${(userRecentScore.accuracy * 100).toPrecision(4)}%) +${modsBuffer}** *played* <t:${new Date(userRecentScore.created_at).getTime() / 1000}:R>\n**Score :** ${userRecentScore.score.toLocaleString()} **PP : ${ppAmount}**`)
            .setThumbnail(`https://assets.ppy.sh/beatmaps/${userRecentScore.beatmapset.id}/covers/list.jpg`)
        return message.channel.send({ embeds: [recentScoreEmbed] });
    }
};