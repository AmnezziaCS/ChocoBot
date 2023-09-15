import mongoose from 'mongoose';

export type ProfileData = {
  userID: string;
  serverID: string;
  chococoins: number;
  dailyCheck: Date;
  osuUserID: string;
};
export const defaultDailyCheck = '2020-04-24';

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true, default: '' },
  serverID: { type: String, require: true, default: '' },
  chococoins: { type: Number, default: 5000 },
  dailyCheck: {
    type: Date,
    require: true,
    default: defaultDailyCheck
  },
  osuUserID: { type: String, default: '' }
});

export const ProfileModel = mongoose.model('ProfileModels', profileSchema);
