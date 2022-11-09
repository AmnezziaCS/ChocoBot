const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ratio")
    .setDescription("Ratio la personne mentionnée !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("La mention de la personne à ratio.")
        .setRequired(true)
    )
    .setDMPermission(false),
  execute({ client: client, unifiedInteraction: unifiedInteraction }) {
    if (unifiedInteraction.type === "interaction") {
      unifiedInteraction.options = [
        unifiedInteraction.options.getUser("utilisateur"),
      ];
      unifiedInteraction.options = [`<@${unifiedInteraction.options[0].id}>`];
    }

    if (!unifiedInteraction.options) {
      return unifiedInteraction.message
        .reply({
          content:
            "Je te ratio toi car tu n'as mentionné personne <:hmmmm:898672241787674634>",
          fetchReply: true,
        })
        .then((sentEmbed) => {
          sentEmbed.react("<:Upvote:724968272218423296>");
        });
    }

    const target = unifiedInteraction.options[0];

    if (!target) {
      return unifiedInteraction.message.reply(
        "La mention n'est pas valable <:Sadge:804417924675797042> choisissez une mention valable pour que la commande marche."
      );
    }

    if (`<@${unifiedInteraction.user.id}>` === target) {
      return unifiedInteraction.message.reply(
        `Tu veux te ratio toi-même, bizarre <:Thonk:665296573294706749>`
      );
    }

    if (`<@${process.env.DISCORD_BOT_ID}>` === target) {
      return unifiedInteraction.message.reply(
        `Tu crois vraiment que tu peux me ratio <:hmmmm:918094679302606878>`
      );
    }

    return unifiedInteraction.message
      .reply({
        content: `Je ratio ${target} <:YEP:800841093515444244>`,
        fetchReply: true,
      })
      .then((sentEmbed) => {
        sentEmbed.react("<:Upvote:724968272218423296>");
      });
  },
};
