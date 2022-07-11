const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ProfileModel = require('../models/profileSchema');
const getUser = require('../osuApi/getUser');

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
        .setName('osuprofile')
        .setDescription("Renvoie l'embed de votre profil osu !"),
    aliases: ['osu', 'opr'],
    async execute(client, message, args, profileData) {
        
        let osuId;

        if (args[0] != null) {

            // Checks if there is a username after the recent command, if there is one, do the command for that username

            osuId = args.join(' ');

        } else {

            // Checks if the message author is linked to an osu account 

            const noOsuAccountEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: "Vous n'avez pas lié de compte osu à votre Discord", iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
                .setDescription("Veuillez utiliser la commande `c!osulink [id osu]` afin de lier votre compte")

            const userDbProfile = await ProfileModel.findOne({ userID: message.author.id }).select("osuUserID").lean();
            if (userDbProfile.osuUserID === '' || userDbProfile.osuUserID == null) return message.channel.send({ embeds: [noOsuAccountEmbed] });
            osuId = profileData.osuUserID;
        }

        const osuUser = await getUser(osuId);
        if (osuUser === null) {
            const wrongIDEmbed = new MessageEmbed()
                .setColor('#F8F70E')
                .setAuthor({ name: `Le joueur que vous avez spécifié n'existe pas !`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
            return message.channel.send({ embeds: [wrongIDEmbed] });
        }

        let voyelBuffer = "de ";
        voyelTab.forEach(element => {
            if (osuUser.username[0].toLowerCase().includes(element)) {
                return voyelBuffer = "d'";
            }
        })

        const recentScoreEmbed = new MessageEmbed()
            .setColor('#F8F70E')
            .setAuthor({ name: `Voici le profil osu ${voyelBuffer}${osuUser.username} !`, iconURL: `https://flagpedia.net/data/flags/icon/120x90/${osuUser.country_code.toLowerCase()}.webp`, url: `https://osu.ppy.sh/users/${osuUser.id}` })
            .setThumbnail(osuUser.avatar_url)
            .setDescription(`• **Rank:** ${osuUser.statistics.global_rank? '#' + osuUser.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ` (${osuUser.country_code}#${osuUser.statistics.rank.country.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`:' `unranked`'}\n• **Ranked score:** ${osuUser.statistics.ranked_score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}\n• **Accuracy:** ${osuUser.statistics.hit_accuracy.toPrecision(4)}%\n• **Level:** ${osuUser.statistics.level.current}.${osuUser.statistics.level.progress}\n• **Scores: ${rankTab.XH} ${osuUser.statistics.grade_counts.ssh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${rankTab.SH} ${osuUser.statistics.grade_counts.sh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${rankTab.X} ${osuUser.statistics.grade_counts.ss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${rankTab.S} ${osuUser.statistics.grade_counts.s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${rankTab.A} ${osuUser.statistics.grade_counts.a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**`)
        return message.channel.send({ embeds: [recentScoreEmbed] });
    }
};