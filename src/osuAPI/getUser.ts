import axios from 'axios';
import { ENV } from '../env';
import { getToken } from './getToken';

export const getUser = async (osuUserId: string | number) => {
  const token = await getToken();

  const auth = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const getUserFromId = await axios
    .get(`${ENV.OSU_API_URL}/users/${osuUserId}`, auth)
    .catch((error) => {
      console.log(`Wrong ID or Problem with the osu API request : ${error}`);
      return null;
    });

  if (!getUserFromId) return null;

  return getUserFromId.data;
};
