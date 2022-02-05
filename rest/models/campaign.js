const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    repoId: {
      type: String,
      index: true,
    },
    userId: { type: String, index: true },
    customerId: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
