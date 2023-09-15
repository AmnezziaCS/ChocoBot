import { ServerModel } from '../models/serverSchema';

export const getServerData = async (serverID: string) => {
  try {
    const serverData = await ServerModel.findOne({ serverID });

    if (!serverData) {
      const profile = await ServerModel.create({
        serverID,
        countingRecord: 0
      });
      profile.save();
      return profile;
    }

    return serverData;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
