const mongoose = require("mongoose");

const FeedBackPlayerModel = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matchs",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    NID: {
      type: String,
      // required: [true, "This Field NID is required"],
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Players",
      },
    ],
    title: {
      type: String,
    },
    message: {
      type: String,
      // required: [true, "This Field Message is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personne",
    },
    nameCreator: {
      type: String,
      // required: [true, "This Field Message is required"],
    },
    imageCreator: {
      type: String,
      // required: [true, "This Field Message is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeedBackPlayer", FeedBackPlayerModel);
