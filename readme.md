# ChocoBot 🍫

An economy/osu! centered discord bot.

## Resources

- [Bot invitation link](https://discord.com/api/oauth2/authorize?client_id=893457417675886602&permissions=534723815488&scope=bot)
- [DiscordJS documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Osu API documentation](https://osu.ppy.sh/docs/index.html)

## Setup

Firstly, you will have to get your local version of the bot:

```sh
git clone https://github.com/amnezziaa/ChocoBot.git
cd ./ChocoBot/
npm ci
```

### Create your Discord bot

You can follow [this link](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) from the Discord JS documentation.

### Create your MongoDB app

You can follow [this link](https://www.mongodb.com/docs/atlas/app-services/apps/create/) from the MongoDB documentation.

### Create your osu! app

You will have to create an osu app [here](https://osu.ppy.sh/home/account/edit#oauth).

### Fill in the .env file

Go to `.env.example` and rename it to `.env`. After that, fill in the values with your own.

Here is a list of the values you will have to fill in:

- `DISCORD_TOKEN`: From the [discord application](https://discord.com/developers/applications) page.
- `DISCORD_BOT_ID`: From the [discord application](https://discord.com/developers/applications) page.
- `BOT_OWNER_ID`: The discord userId of your personal account. It can be obtained by right clicking yourself with developer mode turned on.
- `MONGODB_SRV`: Your MongoDB server token.
- `OSU_API_ID`: Your osu! API ID. It can be found on [this page](https://osu.ppy.sh/home/account/edit#oauth).
- `OSU_API_SECRET`: Your osu! API token. It can be found on [this page](https://osu.ppy.sh/home/account/edit#oauth).

These values are already set in the `.env.example` file so you should't have to change them:

- `BOT_NEEDED_PERMISSION_ID`: Permission float (398023060544).
- `OSU_API_URL`: The osu API URL (https://osu.ppy.sh/api/v2).
- `OSU_TOKEN_URL`: The osu token URL (https://osu.ppy.sh/oauth/token).

### Create your token.json file in osuAPI

Simply rename the `tokenExample.json` file to `token.json`.

### Run the bot

You should now be able to run the bot using:

```sh
npm run dev
```

**Expected result:**

```sh
⏲️ Chargement des commandes slash...
📝 Commande `balance` chargée !
📝 Commande `bet` chargée !
📝 Commande `chocoball` chargée !
📝 Commande `chocobo` chargée !
📝 Commande `counterratio` chargée !
📝 Commande `counting` chargée !
📝 Commande `daily` chargée !
📝 Commande `give` chargée !
📝 Commande `help` chargée !
📝 Commande `leaderboard` chargée !
📝 Commande `meilleurmove` chargée !
📝 Commande `osulink` chargée !
📝 Commande `osuprofile` chargée !
📝 Commande `ratio` chargée !
📝 Commande `recent` chargée !
📝 Commande `rob` chargée !
🍀 Connexion à MongoDB réussie !
🎉 Les commandes slash ont été créées avec succés !
🚀 Connecté en tant que ${BotUsername}!

⏳ Écoute des commandes en cours :
```

### Troubleshooting

If you encounter any problems, make sure the `.env` file is filled with the right values and that your `token.json` file exists in the `src/osuAPI` directory. That being said, if you still have issues, do not hesitate to create an issue in this repository. I will look into it.

## Commands

### Base

- `help`: Displays the help embed.
- `chocobo`: Makes Chocobo appear.
- `ratio [targeted user]`: Allows you to ratio somebody.
- `counterratio`: Counters the previous ratio.
- `meilleurmove`: Elmoka59 video.
- `chocoball [question]`: Works like an 8ball, will give you a magic answer.
- `counting [help (optional)] [lb (optional)]`: Starts a counting game / Displays an help embed / counting leaderboard.

### Economy

- `balance [mention of the target (optional)]`: Allows you to check your ChocoCoins balance.
- `leaderboard`: Displays the ChocoCoins leaderboard.
- `daily`: Gives the user 2000 ChocoCoins, only usable once a day.
- `rob [mention of the target]`: Allows you to steal someone else's ChocoCoins.
- `bet [bet amount]`: 1/2 chance to double your money or lose it all.

### Osu

- `osulink [osu Id]`: Links the user to his osu profile.
- `osuprofile [player username / player Id (optional)]`: Shows the profile of a player.
- `recent [player username / player Id (optional)]`: Shows the last non failed osu score of a player.

### Admin

- `give [value of coins] [mention of the target] [add/remove]`: Allows you to give or remove X amount of ChocoCoins to a particular user.

## Documentation

- [DiscordJS documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Osu API documentation](https://osu.ppy.sh/docs/index.html)
- [Typescript documentation](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Prettier ESLint documentation](https://prettier.io/docs/en/integrating-with-linters.html)
- [Zod Documentation](https://zod.dev/https://zod.dev/)
