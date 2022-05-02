const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent')
        .setDescription('Recent your last osu play !'),
    async execute(client, message, args) {

        function setEnvValue(key, value) {
            const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
            const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
                return line.match(new RegExp(key));
            }));
            ENV_VARS.splice(target, 1, `${key}=${value}`);
            fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
        }

        data = {
            client_id: process.env.OSU_API_ID,
            client_secret: process.env.OSU_API_SECRET,
            grant_type: 'client_credentials',
            scope: 'public'
        }

        if (new Date().getTime() - new Date(process.env.OSU_TOKEN_DATE).getTime() > 80000000) {
            const response = await axios.post(
                'https://osu.ppy.sh/oauth/token',
                data
            )

            setEnvValue('OSU_TEMPORARY_TOKEN', response.data.access_token);
            setEnvValue('OSU_TOKEN_DATE', new Date());


            console.log(response.data.access_token);
        }
        console.log(new Date().getTime() - new Date(process.env.OSU_TOKEN_DATE).getTime())
    }
};