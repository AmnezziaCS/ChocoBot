require("dotenv").config();

const { Client, Collection, Intents } = require("discord.js");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});
client.commands = new Collection();
client.events = new Collection();

["command_handler", "event_handler", "slash_command_handler"].forEach(
  (handler) => {
    require(`./handlers/${handler}`)(client);
  }
);

process.on("unhandledRejection", (e) => console.error(e));
mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(process.env.DISCORD_TOKEN);
// ChocoBotDB
