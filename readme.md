# ChocoBot 🍫
> A Work In Progress Osu related Discord bot. 

**If you want to invite the bot to your server** : [Link here](https://discord.com/api/oauth2/authorize?client_id=893457417675886602&permissions=534723815488&scope=bot) 

I will update this GitHub repo as the project goes on and according to my progress !

## Setup 🌌 :

### Git clone :
>Before doing anything, you will have to get your local version of the bot (you will need both nodeJS and git). To do so :
```sh
git clone https://github.com/amnezziaa/ChocoBot.git
cd ./ChocoBot/
npm install
```
### Create your discord bot, your mongoDB server and fill in the env file :

> You will then have to create a discord bot application, setup a mongoDB server and copy all the needed infos in a .env file. You can copy the example.env file content and replace the void with your values.

### Create your token.json file in osuApi :
> Copy the tokenExample.json file and rename it to token.json.

### Run the bot :
> You can now execute the command `node .` in the directory which should launch the bot. If you encounter a problem, you can try to contact me on discord : Amnezzia#3632
## Available commands 🖱️ :

Commands are usable both textually and using slash.

#### Base :

* `c!help` : Shows the command embed.
* `c!chocobo` : Makes Chocobo appears.
* `c!ratio [mention of the target]` : Allows you to ratio anyone.
* `c!counterratio` : Counters the previous ratio.
* `c!meilleurmove` : elmoka59 vidéo.
* `c!hocoball / ball [question ?]` : Works like an 8ball, will answer to your question with a magic answer.
* `c!cum` : d.. don't use this please.
* `c!counting / count [help (optional)] [lb (optional)]` : This command allows you to start a counting game but can also show you the global couting leaderboard.
* `c!counting / count [help (optional)]` :  This command allows you to fish to try and gain ChocoCoins.

#### Economy :

* `c!balance / bl / bal / b [mention of the target (optional)]` : Allows you to check your balance of ChocoCoins.
* `c!leaderboard / lb` : Shows the ChocoCoins Leaderboard.
* `daily / d` : Gives you 2000 free ChocoCoins everyday.
* `c!rob [mention of the target]` : Allows you to steal someone's ChocoCoins.
* `c!bet [bet amount]` : Allows you to bet a certain amount of ChocoCoins to either win its double or lose it all.

#### Osu :

* `c!osuLink / olink / ol [osu ID]` : Links your osu account to your osu profile.
* `c!osuProfile / opr / osu [player username / player ID (optional)]` : Shows your or the player you mentionned osu profile.
* `c!recent / r / rs [player username / player ID (optional)]` : Shows your or the player you mentionned last osu score. 

#### Admin :

* `c!give [value of coins] [mention of the target]` : Allows you to give or remove X amount of ChocoCoins to a particular user.
