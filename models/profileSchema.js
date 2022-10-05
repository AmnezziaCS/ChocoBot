const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  chococoins: { type: Number, default: 5000 },
  dailyCheck: {
    type: Date,
    require: true,
    default: "2020-04-24T19:44:31.589+0000",
  },
  osuUserID: { type: String, default: "" },
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
