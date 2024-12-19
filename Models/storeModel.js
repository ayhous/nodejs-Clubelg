const mongoose = require("mongoose");

const StoreModel = new mongoose.Schema(
  {
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    title: {
      type: String,
      required: [true, "This field title is require"],
    },
    description: {
      type: String,
      required: [true, "This field description is require"],
    },
    specification: {
      type: String,
    },
    price: {
      basic: {
        type: String,
        required: [true, "This field price basic is require"],
      },
      currency: {
        type: String,
        default: "usd",
      },

      discound: {
        type: String,
        default: "0",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "This field category is require"],
    },

    quantity: {
      type: Number,
      required: [true, "This field quantity is require"],
    },
    pinToSlider: {
      type: Boolean,
      default: false,
    },

    options: {
      colors: [
        {
          type: String,
        },
      ],
      size: [
        {
          type: String,
        },
      ],

      images: [{ type: String }],
    },
    imageShowFirst: {
      type: String,
    },

    imageSlider: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personne",
    },

    NID: {
      type: String,
    },
    favorite: {
      type: Number,
      default: 0,
    },

    whoFavorite: [
      {
        user: { type: mongoose.Schema.Types.ObjectId },
        dateCreated: { type: Date, default: Date.now() },
        typeLogger: {
          type: String,
        },
      },
    ],

    views: {
      type: Number,
      default: 0,
    },
    whoViews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
        dateCreated: { type: Date, default: Date.now() },
        NID: {
          type: String,
        },
        typeLogger: {
          type: String,
        },
      },
    ],

    share: {
      type: Number,
      default: 0,
    },

    whosShare: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
        dateCreated: { type: Date, default: Date.now() },
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

module.exports = mongoose.model("Store", StoreModel);
