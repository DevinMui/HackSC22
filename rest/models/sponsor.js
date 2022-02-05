const mongoose = require("mongoose");

const campaignSchema = mongoose.Schema(
  {
    repoId: {
      type: String,
      index: true,
    },
    goal: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
