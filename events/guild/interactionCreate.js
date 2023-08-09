const ProfileModel = require("../../models/profileSchema");

module.exports = async (client, interaction) => {
  if (!interaction.type === "APPLICATION_COMMAND") return;

  let profileData;
  try {
    profileData = await ProfileModel.findOne({ userID: interaction.user.id });
    if (!profileData) {
      let profile = await ProfileModel.create({
        userID: interaction.user.id,
        serverID: interaction.guild.id,
        chococoins: 5000,
        dailyCheck: "2020-04-24T19:44:31.589+0000",
      });
      profile.save();
    }
  } catch (err) {
    console.log(err);
  }

  let parameterBuffer = "";
  interaction.options._hoistedOptions.forEach((parameter) => {
    parameterBuffer += ` [${parameter.name}: ${parameter.value}]`;
  });

  const discriminator =
    interaction.user.discriminator === "0"
      ? ""
      : `#${interaction.user.discriminator}`;

  console.log(
    `${new Date().toLocaleString()} ${
      interaction.user.username
    }${discriminator} : /${interaction.commandName}${parameterBuffer}`
  );

  const command =
    client.commands.get(interaction.commandName) ||
    client.commands.find(
      (a) => a.aliases && a.aliases.includes(interaction.commandName)
    );

  if (!command)
    return interaction.reply(
      "Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée <:hmmmm:898672241787674634>"
    );

  const unifiedInteraction = {
    message: interaction,
    type: "interaction",
    user: interaction.user,
    options: interaction.options ? interaction.options : [],
    guild: interaction.guild,
  };

  try {
    await command.execute({ client, unifiedInteraction, profileData });
  } catch (err) {
    interaction.reply(
      "Quelque chose n'a pas tourné rond, bizarre. Soit votre commande n'existe pas, soit elle est erronée <:hmmmm:898672241787674634>"
    );
    console.log("Caught error:", err);
  }
};
