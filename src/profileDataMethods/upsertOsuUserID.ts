import { ProfileModel } from '../models/profileSchema';

export const upsertOsuUserID = async (
  userID: string,
  osuUserID: string
): Promise<void> => {
  try {
    await ProfileModel.findOneAndUpdate(
      {
        userID: userID
      },
      {
        $set: {
          osuUserID: osuUserID
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
