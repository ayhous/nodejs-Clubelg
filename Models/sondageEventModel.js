const mongoose = require("mongoose");

const sondageEventModel = new mongoose.Schema(
  {
    eventID: {
      type: String,
      required: [true, "This field name event required"],
      trim: true,
    },
    NID: {
      type: String,
      required: [true, "This field NID required"],
      trim: true,
    },

    responsePlayer: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
        },
        adult: {
          type: String,
          default: 0,
        },
        kids: {
          type: String,
          default: 0,
        },
        priceTotla: {
          type: String,
        },
        paymentState: {
          type: Boolean,
          default: false,
        },

        //after admin check this player pay,
        // he can put information type pay or any information
        paymentInfo: {
          type: String,
        },
      },
    ],
    responsePrsonn: [
      {
        personn: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
        adult: {
          type: String,
          default: 0,
        },
        kids: {
          type: String,
          default: 0,
        },
        paymentState: {
          type: Boolean,
          default: false,
        },
        priceTotla: {
          type: String,
        },
        //after admin check this player pay,
        // he can put information type pay or any information
        paymentInfo: {
          type: String,
        },
      },
    ],

    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sondageEvent", sondageEventModel);
