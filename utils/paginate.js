const paginationEmbed = async (
  unifiedInteraction,
  pages,
  emojiList = ["⏪", "⏩"],
  timeout = 120000
) => {
  if (!unifiedInteraction.message && !unifiedInteraction.channel)
    throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");
  if (emojiList.length !== 2) throw new Error("Need two emojis.");

  let page = 0;

  const curPage = await unifiedInteraction.message.reply({
    embeds: [
      pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
    ],
    fetchReply: true,
  });

  for (const emoji of emojiList) await curPage.react(emoji);

  const filter = (reaction, user) =>
    emojiList.includes(reaction.emoji.name) && !user.bot;
  const reactionCollector = curPage.createReactionCollector({
    filter,
    time: timeout,
  });
  reactionCollector.on("collect", (reaction, user) => {
    if (user.id === unifiedInteraction.user.id) {
      switch (reaction.emoji.name) {
        case emojiList[0]:
          page = page > 0 ? --page : pages.length - 1;
          break;
        case emojiList[1]:
          page = page + 1 < pages.length ? ++page : 0;
          break;
        default:
          break;
      }
      curPage.edit({
        embeds: [
          pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
        ],
      });
    }
    reaction.users.remove(user);
  });
  reactionCollector.on("end", () => {
    curPage.reactions.removeAll();
  });
  return curPage;
};
module.exports = paginationEmbed;
