const mongoose = require("mongoose");

const EventModel = new mongoose.Schema(
  {
    nameEvent: {
      type: String,
      required: [true, "This field name event required"],
      trim: true,
    },
    NID: {
      type: String,
      required: [true, "This field NID required"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "This field text required"],
      trim: true,
    },
    price: {
      adult: {
        type: String,
        default: 0,
      },
      kids: {
        type: String,
        default: 0,
      },
    },
    personn: [String],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    dateEvent: {
      type: String,
      required: [true, "This field dateEvent required"],
    },

    images: [
      {
        type: String,
      },
    ],

    state: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Events", EventModel);
