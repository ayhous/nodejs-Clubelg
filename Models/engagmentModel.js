const mongoose = require("mongoose");

const engagmentModel = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
      required: [true, "This field player date is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "This field category date is required"],
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: [true, "This field season date is required"],
    },
    datePay: {
      type: String,
    },
    state: {
      type: Number,
      default: 1,
    },

    NID: {
      type: String,
      required: [true, "This field NID date is required"],
      trim: true,
    },
    typePayment: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Engagments", engagmentModel);
