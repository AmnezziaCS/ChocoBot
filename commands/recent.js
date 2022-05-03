const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
const axios = require('axios');
require('dotenv').config();
const getToken = require('./osuApi/getToken');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent')
        .setDescription('Recent your last osu play !'),
    aliases: ['r', 'rs'],
    async execute(client, message, args, profileData) {

        const noOsuAccountEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: "Vous n'avez pas lié de compte osu à votre Discord", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            .setDescription("Veuillez utiliser la commande `c!osulink [id osu]` afin de lier votre compte")
        const osuIDExists = await ProfileModel.findOne({ userID: message.author.id }).select("osuUserID").lean();
        if (osuIDExists.osuUserID === '') return message.channel.send({ embeds: [noOsuAccountEmbed] });

        const rankPNG = {
            SSH: '<:SSH:971030365772845156>',
            SS: '<:SS:971030365839970304>',
            SH: '<:SH:971030365810610226>',
            S: '<:S:971030365726711839>',
            A: '<:A_:971030365705732106>',
            B: '<:B:971030365793820672>',
            C: '<:C:971030365613457478>',
            D: '<:D:971030365684793354>'
        }

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

        const token = await getToken();

        const auth = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        const getUserRecentScore = await axios.get(
            `${process.env.OSU_API_URL}/users/${profileData.osuUserID}/scores/recent?limit=1`,
            auth
        ).catch((error) => {
            userFalse = true;
            console.log('Problem with the osu API request')
        });

        if (getUserRecentScore.data[0] != null) {
            const modsBuffer = getUserRecentScore.data[0].mods.join('') || 'Nomod';

            const recentScoreEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Le score le plus récent d'${getUserRecentScore.data[0].user.username} !`, iconURL: `${getUserRecentScore.data[0].user.avatar_url}.jpeg` })
                .setTitle(`${getUserRecentScore.data[0].beatmapset.title} [${getUserRecentScore.data[0].beatmap.version}] - ${getUserRecentScore.data[0].beatmap.difficulty_rating}*`)
                .setURL(`${getUserRecentScore.data[0].beatmap.url}`)
                .setDescription(`${getValue(rankPNG, getUserRecentScore.data[0].rank)} **(${(getUserRecentScore.data[0].accuracy * 100).toPrecision(4)}%) +${modsBuffer}** *played* <t:${new Date(getUserRecentScore.data[0].created_at).getTime() / 1000}:R> \n
                **Score :** ${getUserRecentScore.data[0].score.toLocaleString()} **PP : ${getUserRecentScore.data[0].pp} ** `)
                .setThumbnail(`https://assets.ppy.sh/beatmaps/${getUserRecentScore.data[0].beatmapset.id}/covers/list.jpg`)
            return message.channel.send({ embeds: [recentScoreEmbed] });

        } else {
            const noScoresEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Vous n'avez pas de scores récents !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [noScoresEmbed] });
        }

    }
};