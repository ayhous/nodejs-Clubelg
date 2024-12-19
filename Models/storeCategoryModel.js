const mongoose = require("mongoose");

const storeCategoryModel = new mongoose.Schema(
  {
    listCategories: [
      {
        name: {
          type: String,
          minLength: [
            3,
            "This fiel name terrain must be gritter then 3 characters",
          ],
          trim: true,
          required: [true, "This field name category is required"],
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },

        dateCreated: {
          type: Date,
          default: Date.now(),
        },

        state: {
          type: Boolean,
          default: true,
        },
      },
    ],
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
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

module.exports = mongoose.model("storeCategory", storeCategoryModel);
