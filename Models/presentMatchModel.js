const mongoose = require("mongoose");

const presentMatchModel = new mongoose.Schema(
  {
    dateFin: {
      type: String,
      required: [true, "This field date is required"],
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matchs",
      required: [true, "This field match is required"],
    },
    response: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
        },
        //default value is encour, after click button confirm (change to present)
        //or click button absent(change to absent)
        present: {
          type: String,
          default: "encour",
        },
        date: {
          type: Date,
        },
      },
    ],
    NID: {
      type: String,
      required: [true, "This field NID is required"],
      trim: true,
    },

    idClub: {
      type: String,
      required: [true, "This field NID is required"],
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personne",
    },

    messageCoach: {
      type: String,
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

presentMatchModel.pre(/^find/, function (next) {
  this.populate({
    path: "match",
    select: "_id imageCover matchTime opponent in_out",
  });

  this.populate({
    path: "response.player",
    select: "first_name last_name image",
  });

  this.populate({
    path: "category",
    select: "name -coach -delege -idClub",
  });

  next();
});

module.exports = mongoose.model("PresentMatch", presentMatchModel);
