const mongoose = require("mongoose");

const personnelModel = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "This Field is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    last_name: {
      type: String,
      required: [true, "This Field is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    password: {
      type: String,
      trim: true,
    },
    changePass_after_created: {
      type: Boolean,
      default: true,
    },
    paswordChangedAt: {
      type: Date,
    },
    passwordActive: {
      type: Number,
      default: 0,
    },

    codeForgotPassword: {
      type: String,
      trim: true,
      default: null,
    },
    NID: {
      type: String,
      required: [true, "This Field is required"],
      trim: true,
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    AFN: {
      type: String,
      required: [true, "This Field is required"],
      trim: true,
      unique: [true, "This number id  exist"],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "This Field is required"],
      unique: [true, "This email already exist"],
    },
    emailActive: {
      type: Number,
      default: 0,
    },
    verification_email: {
      type: String,
    },
    timeExpireValidEmail: {
      type: Date,
    },
    phone: {
      type: String,
      required: [true, "This Field is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    rules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rules",
      },
    ],
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
    birthDay: {
      type: Date,
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
  { timestamps: true }
);

personnelModel.pre(/^find/, function (next) {
  this.populate({
    path: "rules",
    select: "_id name",
  });

  next();
});

// const setImage = (doc) => {
//   if (doc.image) {
//     const imagePath = `${process.env.BASE_URL}${doc.image}`;

//     doc.image = imagePath;
//   }
// };

// personnelModel.post("init", (doc) => {
//   setImage(doc);
// });

// personnelModel.post("save", (doc) => {
//   setImage(doc);
// });

module.exports = mongoose.model("Personne", personnelModel);
