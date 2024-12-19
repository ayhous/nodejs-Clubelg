const mongoose = require("mongoose");

const MatchModel = new mongoose.Schema(
  {
    opponent: {
      type: String,
      required: [true, "This field opponent is required"],
      minLength: [3, "must be length opponent gretter then 3 characters"],
    },
    opponentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      default: null,
    },
    // Season: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Seasons",
    //   required: [true, "This field Season is required"],
    // },
    stateMatch: {
      type: String,
      enum: ["live", "ended", "soon"],
      default: "soon",
    },
    whoAdd: [
      {
        personn: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
        description: {
          type: String,
        },
        dateCreated: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    typeMatch: {
      type: String,
      required: [true, "This field Season is required"],
    },
    matchTime: {
      type: Date,
      required: [true, "This field is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "This field Category is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personne",
    },
    in_out: {
      type: String,
      enum: ["in", "out"],
      required: [true, "This field is required"],
    },
    addressMatch: {
      type: String,
    },
    canceledMatch: {
      type: Number,
      default: 1,
    },
    canceledRaison: {
      type: String,
    },
    terrain: {
      type: String,
    },

    state: {
      type: Number,
      default: 1,
    },
    NID: {
      type: String,
      required: [true, "This field is required"],
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    imageCover: {
      type: String,
    },
    images: [
      {
        name: {
          type: String,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personne",
        },
        dateCreated: {
          type: Date,
          default: Date.now(),
        },
        text: {
          type: String,
          default: null,
        },
        permissionView: {
          type: String,
          enum: ["public", "club", "category"],
          default: "public",
        },
      },
    ],
    videos: [String],
    notification: {
      startMatch: [
        {
          idUser: {
            type: mongoose.Schema.Types.ObjectId,
            toRef: "Personne",
          },
          dateCreated: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      goal: [
        {
          idUser: {
            type: mongoose.Schema.Types.ObjectId,
            toRef: "Personne",
          },
          dateCreated: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      media: [
        {
          idUser: {
            type: mongoose.Schema.Types.ObjectId,
            toRef: "Personne",
          },
          dateCreated: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      endMatch: [
        {
          idUser: {
            type: mongoose.Schema.Types.ObjectId,
            toRef: "Personne",
          },
          dateCreated: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
    },
  },

  {
    timestamps: true,
  }
);

const setImage = (doc) => {
  if (doc.imageCover) {
    const imagePath = `${process.env.BASE_URL}${doc.imageCover}`;
    doc.imageCover = imagePath;
  }

  if (doc.images) {
    // Transform each image object to include the full URL for the 'name' field
    const photos = doc.images.map((element) => ({
      _id: element._id,
      dateCreated: element.dateCreated,
      name: `${process.env.BASE_URL}${element.name}`, // Prepend base URL to image name
      permissionView: element.permissionView,
    }));

    doc.photos = photos; // Assign the transformed array to doc.photos
  }
};

MatchModel.post("init", (doc) => {
  setImage(doc);
});

MatchModel.post("save", (doc) => {
  setImage(doc);
});

MatchModel.pre(/^find/, function (next) {
  this.populate({ path: "idClub", select: "logo name" });
  this.populate({ path: "category", select: "name -coach -delege -idClub" });

  this.populate({ path: "opponentID", select: "name logo" });
  next();
});

module.exports = mongoose.model("Matchs", MatchModel);
