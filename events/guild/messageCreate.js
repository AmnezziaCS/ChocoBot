const ProfileModel = require("../../models/profileSchema");
const newDate = require("../../utils/newDate");

module.exports = async (client, message) => {
  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  let profileData;
  try {
    profileData = await ProfileModel.findOne({ userID: message.author.id });
    if (!profileData) {
      let profile = await ProfileModel.create({
        userID: message.author.id,
        serverID: message.guild.id,
        chococoins: 5000,
        dailyCheck: "2020-04-24T19:44:31.589+0000",
      });
      profile.save();
    }
  } catch (err) {
    console.log(err);
  }

  console.log(
    `${newDate(message.createdAt)}${message.author.username}#${
      message.author.discriminator
    } : ${message}`
  );

  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  const command =
    client.commands.get(cmd) ||
    client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

  if (!command)
    return message.reply(
      "Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée <:hmmmm:898672241787674634>"
    );

  const unifiedInteraction = {
    message,
    type: "message",
    user: message.author,
    options: args,
    guild: message.guild,
  };

  try {
    await command.execute({ client, unifiedInteraction, profileData });
  } catch (err) {
    message.reply(
      "Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée <:hmmmm:898672241787674634>"
    );
    console.log("Catched error:", err);
  }
};
