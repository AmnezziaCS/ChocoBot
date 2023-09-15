import { ProfileModel } from '../models/profileSchema';

export const updateProfileDataDaily = async (userID: string): Promise<void> => {
  try {
    await ProfileModel.findOneAndUpdate(
      { userID },
      {
        $inc: {
          chococoins: 2000
        },
        $set: {
          dailyCheck: new Date()
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
