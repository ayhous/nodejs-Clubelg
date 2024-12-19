const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field name is required"],
      minLength: [2, "Min length character field name is 2"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personne",
    },
    NID: {
      type: String,
      required: [true, "This field name is required"],
      trim: true,
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    coach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personne",
      },
    ],
    delege: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personne",
      },
    ],
    priceInscription: {
      type: Number,
      required: [true, "This field price inscription is required"],
    },
    image: {
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

const setImage = (doc) => {
  if (doc.image) {
    const imagePath = `${process.env.BASE_URL}${doc.image}`;

    doc.image = imagePath;
  }
};

CategoryModel.post("init", (doc) => {
  setImage(doc);
});

CategoryModel.post("save", (doc) => {
  setImage(doc);
});

CategoryModel.pre(/^find/, function (next) {
  this.populate({
    path: "coach",
    select: "_id first_name last_name image",
  });

  this.populate({
    path: "idClub",
    select: "_id logo name",
  });

  next();
});

CategoryModel.pre(/^find/, function (next) {
  this.populate({
    path: "delege",
    select: "_id first_name last_name image",
  });

  next();
});

module.exports = mongoose.model("Category", CategoryModel);
