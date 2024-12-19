const mongoose = require("mongoose");

const PlayerModel = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "This Field first name is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    last_name: {
      type: String,
      required: [true, "This Field last name is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    NID: {
      type: String,
      required: [true, "This Field NID is required"],
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
    rules: {
      type: [String],
      default: ["player"],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "This Field email is required"],
    },
    emailActive: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      trim: true,
    },
    passwordActive: {
      type: Number,
      default: 0,
    },
    paswordChangedAt: {
      type: Date,
    },
    codeForgotPassword: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "This Field phone is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      required: [true, "This Field address is required"],
    },
    gender: {
      type: String,
      required: [true, "This Field gender  is required"],
      enum : ['man','woman']
    },
    birthDay: {
      type: Date,
      required: [true, "This Field birthDay is required"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parents",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "This Field category is required"],
    },
    position : {
      type: String,
    },
    numberPlayer : {
      type: String,
    },
    followers : [
      {
        idFollower : {
          type: mongoose.Schema.Types.ObjectId,
          refPath : 'typeFollower'
        },
        typeFollower: {
          type: String,
        },
        acceptFollower: {
          type: Boolean,
          default: false
        },
        dateSendFollower:{
          type: Date,

        },
        dateAcceptFollower:{
          type: Date,
          
        }
      }
    ],
    following : [
      {
        idFollowing : {
          type: mongoose.Schema.Types.ObjectId,
          refPath : 'typeFollowing'
        },
        typeFollowing: {
          type: String,
        },
        acceptFollowing: {
          type: Boolean,
          default: false
        },
        dateSendFollowing:{
          type: Date,

        },
        dateAcceptFollowing:{
          type: Date,
          
        }
      }
    ],
    state: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const setImage = (doc) => {
  if (doc.image) {
    const imagePath = `${process.env.BASE_URL}${doc.image}`;

    doc.image = imagePath;
  }
};

PlayerModel.post("init", (doc) => {
  setImage(doc);
});

PlayerModel.post("save", (doc) => {
  setImage(doc);
});

module.exports = mongoose.model("Players", PlayerModel);
