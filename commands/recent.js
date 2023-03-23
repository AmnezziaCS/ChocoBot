const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ProfileModel = require("../models/profileSchema");
const getUser = require("../osuApi/getUser");
const getUserRecentScore = require("../osuApi/getUserRecentScore");

function getValue(obj, key) {
  return obj[key];
}

const rankTab = {
  XH: "<:XH:971030365772845156>",
  X: "<:X_:971030365839970304>",
  SH: "<:SH:971030365810610226>",
  S: "<:S:971030365726711839>",
  A: "<:A_:971030365705732106>",
  B: "<:B:971030365793820672>",
  C: "<:C:971030365613457478>",
  D: "<:D:971030365684793354>",
};

const voyelArray = ["a", "e", "i", "o", "u", "y"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recent")
    .setDescription("Renvoie votre dernier play osu en date !")
    .addStringOption((option) =>
      option
        .setName("utilisateur")
        .setDescription(
          "Le pseudo ou id de la personne dont vous souhaitez voir le dernier play."
        )
    )
    .setDMPermission(false),
  aliases: ["r", "rs"],
  async execute({
    client: client,
    unifiedInteraction: unifiedInteraction,
    profileData: profileData,
  }) {
    const avatarUrl = `${unifiedInteraction.user.id}/${unifiedInteraction.user.avatar}`;
    let osuId;
    let osuUsername;

    if (unifiedInteraction.type === "message") {
      if (unifiedInteraction.options[0] != null) {
        osuUsername = unifiedInteraction.options.join(" ");
      }
    } else {
      if (unifiedInteraction.options.getString("utilisateur") != null) {
        osuUsername = unifiedInteraction.options.getString("utilisateur");
      }
    }

    if (osuUsername) {
      // If there is a name after the command, do the command for that username

      const osuUser = await getUser(osuUsername);
      if (osuUser === null) {
        const wrongIDEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
          name: `Le joueur que vous avez spécifié n'existe pas !`,
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        });
        return unifiedInteraction.message.reply({ embeds: [wrongIDEmbed] });
      }
      osuId = osuUser.id;
    } else {
      // Checks if the message author is linked to an osu account

      const noOsuAccountEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setAuthor({
          name: "Vous n'avez pas lié de compte osu à votre Discord",
          iconURL: `https://cdn.discordapp.com/avatars/${avatarUrl}.jpeg`,
        })
        .setDescription(
          "Veuillez utiliser la commande `c!osulink [id osu]` afin de lier votre compte"
        );

      const userDbProfile = await ProfileModel.findOne({
        userID: unifiedInteraction.user.id,
      })
        .select("osuUserID")
        .lean();
      if (userDbProfile.osuUserID === "" || userDbProfile.osuUserID == null)
        return unifiedInteraction.message.reply({
          embeds: [noOsuAccountEmbed],
        });
      osuId = profileData.osuUserID;
    }

    const userRecentScore = await getUserRecentScore(1, osuId);

    // If user has no recent score

    if (!userRecentScore) {
      const noScoresEmbed = new MessageEmbed().setColor("#F8F70E").setAuthor({
        name: `L'utilisateur n'a pas de scores récents !`,
        iconURL: `https://a.ppy.sh/${osuId}?.jpeg`,
        url: `https://osu.ppy.sh/users/${osuId}`,
      });
      return unifiedInteraction.message.reply({ embeds: [noScoresEmbed] });
    }

    let ppAmount = "`null`";
    if (userRecentScore.pp) ppAmount = userRecentScore.pp.toPrecision(4);

    const modsBuffer = userRecentScore.mods.join("") || "Nomod";

    // Create the embed

    const recentScoreEmbed = new MessageEmbed()
      .setColor("#F8F70E")
      .setAuthor({
        name: `Le score le plus récent ${voyelArray.includes(userRecentScore.user.username[0].toLowerCase()) ? "d'" : "de "}${userRecentScore.user.username} !`,
        iconURL: `https://a.ppy.sh/${osuId}?.jpeg`,
        url: `https://osu.ppy.sh/users/${userRecentScore.user.id}`,
      })
      .setTitle(
        `${userRecentScore.beatmapset.title} [${userRecentScore.beatmap.version}] - ${userRecentScore.beatmap.difficulty_rating}*`
      )
      .setURL(`${userRecentScore.beatmap.url}`)
      .setDescription(
        `${getValue(rankTab, userRecentScore.rank)} **(${(
          userRecentScore.accuracy * 100
        ).toPrecision(4)}%) +${modsBuffer}** *played* <t:${
          new Date(userRecentScore.created_at).getTime() / 1000
        }:R>\n**Score :** ${userRecentScore.score.toLocaleString()} **PP : ${ppAmount}**`
      )
      .setThumbnail(
        `https://assets.ppy.sh/beatmaps/${userRecentScore.beatmapset.id}/covers/list.jpg`
      );
    return unifiedInteraction.message.reply({ embeds: [recentScoreEmbed] });
  },
};
