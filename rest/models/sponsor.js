const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    repoId: {
      type: String,
      index: true,
    },
    userId: { type: String, index: true },
    subscriptionId: { type: String, index: true },
    paymentAccepted: { type: Boolean, index: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
