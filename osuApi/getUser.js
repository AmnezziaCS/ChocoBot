const axios = require('axios');
const getToken = require('../osuApi/getToken');

const getUser = async (userID) => {

    const token = await getToken();

    const auth = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const getUserFromID = await axios.get(
        `${process.env.OSU_API_URL}/users/${userID}`,
        auth
    ).catch((error) => {
        console.log('Wrong ID or Problem with the osu API request')
        return null;
    });

    if (!getUserFromID) return null;

    return getUserFromID.data;
}

module.exports = getUser;