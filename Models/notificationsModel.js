const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema(
  {
    typeAction: {
      type: String,
      required: [true, "This field type action is required"],
    },
    idAction: {
      type: mongoose.Schema.Types.ObjectId,
    },
    actionCreator: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "typeCreator",
    },
    typeCreator: {
      type: String,
      enum: ["Personne", "Player"],
      default: "Personne",
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
    },
    NID: {
      type: String,
      required: [true, "This field NID is required"],
    },
    state: {
      type: Number,
      default: 1,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
    },
    imageCreator: {
      type: String,
      default: "",
    },
    nameCreator: {
      type: String,
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    vue: {
      type: Number,
      default: 0,
    },
    timeVue: {
      type: Date,
      default: null,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

notificationModel.pre(/^find/, function (next) {
  this.populate({
    path: "actionCreator",
    select: "_id first_name last_name image",
  });

  next();
});

module.exports = mongoose.model("Notification", notificationModel);
