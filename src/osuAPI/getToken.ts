import axios from 'axios';
import fs from 'fs';
import { ENV } from '../env';
import jsonData from './token.json';

type Token = {
  osuToken: string;
  osuTokenDate: string;
};

const fileName = 'src/osuAPI/token.json';

export const getToken = async (): Promise<string> => {
  const osuTokenObject: Token = jsonData;
  const data = {
    client_id: ENV.OSU_API_ID,
    client_secret: ENV.OSU_API_SECRET,
    grant_type: 'client_credentials',
    scope: 'public'
  };

  const timeDiference =
    new Date().getTime() - new Date(osuTokenObject.osuTokenDate).getTime();

  // If token is still alive, we reuse it

  if (timeDiference < 80000000) {
    console.log(
      `🟣 Last osu token is still alive, ${80000 - timeDiference / 1000}s left`
    );
    return osuTokenObject.osuToken;
  }

  // If not we create a new one

  const response = await axios.post('https://osu.ppy.sh/oauth/token', data);

  osuTokenObject.osuToken = response.data.access_token;
  osuTokenObject.osuTokenDate = new Date().toISOString();

  fs.writeFile(
    fileName,
    JSON.stringify(osuTokenObject),
    function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(osuTokenObject));
      console.log('writing to ' + fileName);
    }
  );

  console.log(`🟣 Last osu token has expired, generating a new one.`);
  return response.data.access_token;
};
