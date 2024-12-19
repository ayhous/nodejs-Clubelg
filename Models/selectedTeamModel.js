const mongoose = require("mongoose");

const seleectedTeamModel = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matchs",
      required: [true, "This field match is required"],
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Players",
      },
    ],
    NID: {
      type: String,
      required: [true, "This field NID is required"],
      trim: true,
    },

    idSondage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PresentMatch",
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PresentMatch",
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

seleectedTeamModel.pre("find", function (next) {
  this.populate({ path: "players", select: "_id first_name last_name image" });
  // this.populate({ path: "Season", select: "dateSeason" });
  // this.populate({ path: "match", select: "opponent" });
  next();
});

// seleectedTeamModel.get("init", function (next) {
//   this.populate({ path: "player", select: "_id first_name last_name image" });
//   // this.populate({ path: "Season", select: "dateSeason" });
//   // this.populate({ path: "match", select: "opponent" });
//   next();
// });

module.exports = mongoose.model("seleectedTeam", seleectedTeamModel);
