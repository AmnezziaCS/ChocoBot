const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  countingRecord: { type: Number, default: 0 },
});

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;
