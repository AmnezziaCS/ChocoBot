# ChocoBot 🍫

> A Work In Progress Osu related Discord bot.

## Resources

- [Bot invitation link](https://discord.com/api/oauth2/authorize?client_id=893457417675886602&permissions=534723815488&scope=bot)

## Setup

### Git clone

Before doing anything, you will have to get your local version of the bot. It will require you to have installed :

- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

Then you can go in your cmd and run :

```sh
git clone https://github.com/amnezziaa/ChocoBot.git
cd ./ChocoBot/
npm ci
```

### Create your discord bot

You can follow [this page](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) from the Discord JS documentation.

### Create your MongoDB app

You can follow [this page](https://www.mongodb.com/docs/atlas/app-services/apps/create/) from the MongoDB documentation.

### Create your osu app

You will have to create an osu app on [this page](https://osu.ppy.sh/home/account/edit#oauth).

### Fill in the .env file

You will need these values :

- `DISCORD_TOKEN` : From the [discord application](https://discord.com/developers/applications) page.
- `DISCORD_BOT_ID` : From the [discord application](https://discord.com/developers/applications) page.
- `BOT_OWNER_ID` : The discord userId of your personal account. It can be obtained by right clicking on your profile with developer mode turned on.
- `MONGODB_SRV` : Your MongoDB server token.
- `OSU_API_ID` = Your osu API Id, can be found on [this page](https://osu.ppy.sh/home/account/edit#oauth).
- `OSU_API_SECRET` : Your osu API Token, can be found on [this page](https://osu.ppy.sh/home/account/edit#oauth).

Once acquired, fill in the `.env.example` file and rename it to `.env`. As for the already given values, don't worry about them unless you really want to play around with the bot.

- `BOT_NEEDED_PERMISSION_ID = 398023060544` : Permission float.
- `OSU_API_URL = https://osu.ppy.sh/api/v2` : This value shouldn't be touched.
- `OSU_TOKEN_URL = https://osu.ppy.sh/oauth/token` : This value shouldn't be touched.

### Create your token.json file in osuAPI

Simply rename the `tokenExample.json` file to `token.json`.

### Run the bot

You should now be able to run the bot using :

```sh
npm run dev
```

**Expected result :**

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
🚀 Connecté en tant que {BotUsername#Discriminator}!

⏳ Écoute des commandes en cours :
```

### Troubleshooting

If you encounter any problems, make sure the `.env` file is filled with the right values and that your `token.json` file exists in the `src/osuAPI` directory. That being said, if you still have issues, do not hesitate to create an issue in this repository. I will look into it.

## Commands

### Base

- `help` : Displays the help embed.
- `chocobo` : Makes Chocobo appear.
- `ratio [targeted user]` : Allows you to ratio somebody.
- `counterratio` : Counters the previous ratio.
- `meilleurmove` : Elmoka59 video.
- `chocoball [question]` : Works like an 8ball, will give you a magic answer.
- `counting [help (optional)] [lb (optional)]` : Starts a counting game / Displays an help embed / counting leaderboard.

### Economy

- `balance [mention of the target (optional)]` : Allows you to check your ChocoCoins balance.
- `leaderboard` : Displays the ChocoCoins leaderboard.
- `daily` : Gives the user 2000 ChocoCoins, only usable once a day.
- `rob [mention of the target]` : Allows you to steal someone else's ChocoCoins.
- `bet [bet amount]` : 1/2 chance to double your money or lose it all.

### Osu

- `osulink [osu Id]` : Links the user to his osu profile.
- `osuprofile [player username / player Id (optional)]` : Shows the profile of a player.
- `recent [player username / player Id (optional)]` : Shows the last non failed osu score of a player.

### Admin

- `give [value of coins] [mention of the target] [add/remove]` : Allows you to give or remove X amount of ChocoCoins to a particular user.

## Documentation

- [DiscordJS documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Osu API documentation](https://osu.ppy.sh/docs/index.html)
