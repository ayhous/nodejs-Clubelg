const mongoose = require("mongoose");

const rulesModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field name rule is required"],
      // unique: [true, "This field name rule must be unique"],
      trim: true,
    },
    NID: {
      type: String,
      required: [true, "This field is required !!!!!"],
      trim: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "This field is required !!!!!"],
      ref: "Club",
    },
    actionRules: {
      type: Object,
      required: [true, "This field is required !!!!!"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rules", rulesModel);
