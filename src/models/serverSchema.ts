import mongoose, { Schema } from 'mongoose';

export type ServerData = {
  serverID: string;
  countingRecord: number;
};

const serverSchema = new Schema({
  serverID: { type: String, require: true, unique: true, default: '' },
  countingRecord: { type: Number, default: 0 }
});

export const ServerModel = mongoose.model('ServerModels', serverSchema);
