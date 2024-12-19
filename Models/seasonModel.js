const mongoose = require("mongoose");

const seasonModel = new mongoose.Schema(
  {
    dateSeason: {
      type: String,
      required: [true, "This field season date is required"],
      trim: true,
      unique: [true, "This field season date is exist"],
    },
    NID: {
      type: String,
      required: [true, "This field NID is required"],
      trim: true,
    },
    state: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Season", seasonModel);
