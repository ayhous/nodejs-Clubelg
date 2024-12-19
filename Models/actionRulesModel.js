const mongoose = require("mongoose");

const actionRulesModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field name rule is required"],
      unique: [true, "This field name rule must be unique"],
      trim: true,
    },
    description: {
      type: String,
    },
    actions: [
      {
        name_action: {
          type: String,
          required: [true, "This field action is required"],
          unique: [true, "This field action must be unique"],
          trim: true,
        },
        value_action: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActionRules", actionRulesModel);
