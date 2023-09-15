import { ServerModel } from '../models/serverSchema';

export const updateServerRecord = async (
  serverID: string,
  record: number
): Promise<void> => {
  try {
    await ServerModel.findOneAndUpdate(
      { serverID },
      {
        countingRecord: record
      }
    );
  } catch (err) {
    console.log(err);
  }
};
