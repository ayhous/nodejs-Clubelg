const mongoose = require("mongoose");

const resultMatchModel = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matchs",
      required: [true, "This field match is required"],
    },
    NID: {
      type: String,
      required: [true, "This field NID is required"],
      trim: true,
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    finalResult: {
      teamA: {
        type: Number,
        default: 0,
      },
      teamB: {
        type: Number,
        default: 0,
      },
    },
    goalInfoA: [
      {
        goalPlayer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          default: null,
        },
        goalAssist: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          default: null,
        },
        time: {
          type: String,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
      },
    ],
    goalInfoB: [
      {
        goalPlayer: {
          type: String,
          default: "xxx",
        },
        goalAssist: {
          type: String,
          default: "xxx",
        },
        time: {
          type: String,
        },
      },
    ],
    card: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
        },
        time: {
          type: String,
        },

        icon: {
          type: String,
          default: "yellow-card",
        },
        type: {
          type: String,
          default: "yellow",
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
      },
    ],
    change: [
      {
        player_in: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          default: null,
        },
        player_out: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          default: null,
        },
        time: {
          type: String,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
      },
    ],
    state: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

resultMatchModel.pre(/^find/, function (next) {
  this.populate({
    path: "goalInfoA.goalPlayer",
    select: "first_name last_name",
  });
  this.populate({
    path: "goalInfoA.goalAssist",
    select: "first_name last_name",
  });
  this.populate({ path: "card.player", select: "first_name last_name" });
  this.populate({ path: "change.player_in", select: "first_name last_name" });
  this.populate({ path: "change.player_out", select: "first_name last_name" });
  next();
});

module.exports = mongoose.model("resultMatch", resultMatchModel);
