const mongoose = require("mongoose");

const terrainModel = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [
        3,
        "This fiel name terrain must be gritter then 3 characters",
      ],
      trim: true,
    },
    NID: {
      type: String,
      required: [true, "This field NID is required"],
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

module.exports = mongoose.model("Terrains", terrainModel);
