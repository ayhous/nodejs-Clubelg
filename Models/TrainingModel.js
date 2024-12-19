const mongoose = require("mongoose");

const trainingModel = new mongoose.Schema(
  {
    NID: {
      type: String,
      required: [true, "This field NID is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "This field category is required"],
      unique: [true, "This category eis exist"],
    },
    dayTraining: [
      {
        day: {
          type: String,
          required: [true, "This field day is required"],
          trim: true,
        },
        timeStartTraining: {
          type: String,
          required: [true, "This field time Start Training is required"],
          trim: true,
        },
        timeEndTraining: {
          type: String,
          required: [true, "This field time End Training is required"],
          trim: true,
        },
      },
    ],
    state: {
      type: Number,
      default: 1,
    },
    terrain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terrains",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Training", trainingModel);
