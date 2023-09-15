import {
  ProfileData,
  ProfileModel,
  defaultDailyCheck
} from '../models/profileSchema';

export const getProfileData = async (
  userID: string,
  serverID: string
): Promise<ProfileData | undefined> => {
  try {
    const profileData = await ProfileModel.findOne({ userID });

    if (!profileData) {
      const profile = await ProfileModel.create({
        userID,
        serverID,
        chococoins: 5000,
        dailyCheck: defaultDailyCheck
      });
      profile.save();
      return profile;
    }

    return profileData;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
