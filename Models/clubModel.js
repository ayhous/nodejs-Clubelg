const mongoose = require("mongoose");

const clubModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "This field name is require"],
      unique: [true, "This field must be unique"],
      minLength: [3, "This field mustt be gretter then 3 Characters"],
      trim: true,
    },
    NID: {
      type: String,
      required: [true, "This field is required !!!!!"],
      // unique: [true, "This field must be unique"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "This field email is require"],
      unique: [true, "This field must be unique"],
      trim: true,
    },
    clubActive: {
      type: Number,
      default: 1,
    },
    followers: [
      {
        idFollower: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "typeFollower",
        },
        typeFollower: {
          type: String,
        },
        acceptFollower: {
          type: Boolean,
          default: false,
        },
        dateSendFollower: {
          type: Date,
        },
        dateAcceptFollower: {
          type: Date,
        },
      },
    ],
    following: [
      {
        idFollowing: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "typeFollowing",
        },
        typeFollowing: {
          type: String,
        },
        acceptFollowing: {
          type: Boolean,
          default: false,
        },
        dateSendFollowing: {
          type: Date,
        },
        dateAcceptFollowing: {
          type: Date,
        },
      },
    ],
    fax: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "This field is require"],
      minLength: [3, "This field mustt be gretter then 3 Characters"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "This field phone is require"],
      trim: true,
    },
    localisation: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
    },
    AllImagesCover: [
      {
        imageCover: {
          type: String,
          trim: true,
        },
      },
    ],
    stars: {
      type: Number,
    },
    state: {
      type: Number,
      default: 1,
    },

    country: {
      currency: {
        type: String,
      },
      flag: {
        type: String,
      },
      isoCode: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      name: {
        type: String,
      },
      phonecode: {
        type: String,
      },
      timezones: [
        {
          abbreviation: {
            type: String,
          },
          gmtOffset: {
            type: String,
          },
          gmtOffsetName: {
            type: String,
          },
          tzName: {
            type: String,
          },
          zoneName: {
            type: String,
          },
        },
      ],
    },
    stateCountry: {
      countryCode: {
        type: String,
      },
      isoCode: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    city: {
      countryCode: {
        type: String,
      },
      stateCode: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const setImage = (doc) => {
  // if (doc.imageCover) {
  //   const imagePath = `${process.env.BASE_URL}${doc.imageCover}`;

  //   doc.imageCover = imagePath;
  // }

  // if (doc.AllImagesCover) {
  //   const allimageCoverPath = doc.AllImagesCover.map(element => ({
  //     _id: element._id,
  //     imageCover: `${process.env.BASE_URL}${element.imageCover}`
  //   }));
  //   doc.AllImagesCover = allimageCoverPath;
  // }

  if (doc.logo) {
    const imagePathLogo = `${process.env.BASE_URL}${doc.logo}`;

    doc.logo = imagePathLogo;
  }
};

clubModel.post("init", (doc) => {
  setImage(doc);
});

clubModel.post("save", (doc) => {
  setImage(doc);
});

module.exports = mongoose.model("Club", clubModel);
