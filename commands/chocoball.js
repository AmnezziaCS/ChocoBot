const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hocoball")
    .setDescription("Posez une question à la boule magique.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription(
          "La question à poser à la boule magique. Un point d'interrogation est obligatoire !"
        )
        .setRequired(true)
    )
    .setDMPermission(false),
  aliases: ["ball"],
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    let content;
    let questionPlaceholder = "";

    if (unifiedInteraction.type === "message") {
      content = unifiedInteraction.message.content;
    } else {
      content = unifiedInteraction.options.getString("question");
      questionPlaceholder = `Question : **${content}** \`->\` `;
    }

    if (!content.includes("?")) {
      const chocoballExplanationsEmbed = new MessageEmbed()
        .setColor("#F8F70E")
        .setTitle("ChocoBall")
        .setDescription(
          "La ChocoBall magique vous permez d'avoir la réponse magique à votre question <:YEP:800841093515444244>"
        )
        .addFields({
          name: "`c!hocoBall / ball [question ?]`",
          value:
            "Donnera la réponse à votre question, n'oubliez pas le point d'interrogation !",
        });
      return unifiedInteraction.message.reply({
        embeds: [chocoballExplanationsEmbed],
      });
    }

    const answerTab = [
      "Re-demandez plus tard <:pepoG:948676211213758474>",
      "Certainement <:Thonk:665296573294706749>",
      "Absolument <:D_:842898126645362758> !!!",
      "Je n'en suis pas certain <:hmmmm:898672241787674634>",
      "Pas du tout <a:NOPERS:804801139702628392>",
      "Je ne me prononcerais pas <:YEP:800841093515444244>",
      "Non <a:NOPERS:804801139702628392>",
      "Concentrez vous et re-demandez <:pepoG:948676211213758474>",
      "Oui <a:NODDERS:804418094625718362>"
    ]

    return unifiedInteraction.message.reply(`${questionPlaceholder}` + answerTab[getRandomInt(9)]);
  },
};
