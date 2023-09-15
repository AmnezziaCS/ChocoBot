import { ProfileModel } from '../models/profileSchema';

export const updateUserChococoins = async (
  userID: string,
  updateValue: number
): Promise<void> => {
  try {
    await ProfileModel.findOneAndUpdate(
      { userID },
      { chococoins: updateValue }
    );
  } catch (err) {
    console.log(err);
  }
};
