const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    staffCardId: {
      type: String,
      default: "none",
    },
    locationCardId: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "none",
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sequence", sequenceSchema);
