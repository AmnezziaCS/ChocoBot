const axios = require('axios');
const fs = require('fs');
const fileName = './token.json';
const jsonObject = require('./token.json');

const getToken = async () => {

    data = {
        client_id: process.env.OSU_API_ID,
        client_secret: process.env.OSU_API_SECRET,
        grant_type: 'client_credentials',
        scope: 'public'
    }

    if (new Date().getTime() - new Date(jsonObject.osuTokenDate).getTime() > 80000000) {
        const response = await axios.post(
            'https://osu.ppy.sh/oauth/token',
            data
        )

        jsonObject.osuToken = response.data.access_token;
        jsonObject.osuTokenDate = new Date();

        fs.writeFile(fileName, JSON.stringify(jsonObject), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(jsonObject,));
            console.log('writing to ' + fileName);
        });

        console.log(`Last token has expired, generating a new one.`);
        return response.data.access_token;
    } else {
        const timeDiference = new Date().getTime() - new Date(jsonObject.osuTokenDate).getTime();
        console.log(`Last token still alive, ${80000 - (timeDiference / 1000)}s left`);
        return jsonObject.osuToken;
    }
}

module.exports = getToken;