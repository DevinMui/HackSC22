const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    repoId: {
      type: String,
      index: true,
    },
    userId: { type: String, index: true },
    avatarUrl: { type: String },
    subscriptionId: { type: String, index: true },
    paymentAccepted: { type: Boolean, index: true, default: false },
    contribution: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
