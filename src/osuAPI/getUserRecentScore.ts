import axios from 'axios';
import { getToken } from './getToken';

export const getUserRecentScore = async ({
  limit,
  userId
}: {
  limit: number;
  userId: number;
}) => {
  const token = await getToken();

  const auth = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const userRecentScore = await axios
    .get(
      `${process.env.OSU_API_URL}/users/${userId}/scores/recent?limit=${limit}`,
      auth
    )
    .catch((error) => {
      console.log(error);
      console.log('Problem with the osu API request');
      return null;
    });

  if (!userRecentScore) return null;

  return userRecentScore.data[0];
};
