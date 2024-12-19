const mongoose = require("mongoose");

const PostsModel = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "This Field created is required"],
      refPath: "typeCreator",
    },
    imageProfileCreated: {
      type: String,
    },
    typeCreator: {
      type: String,
      enum: ["Personne", "Players"],
      default: "Personne",
    },
    nameCreated: {
      type: String,
    },
    text: {
      type: String,
    },
    NID: {
      type: String,
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    photos: [{ type: String }],
    video: { type: String, default: null },
    location: {
      type: String,
      default: null,
    },
    postJoined: {
      type: String,
      default: null,
    },
    modelJoined: {
      type: String,
      default: null,
    },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId },
        dateCreated: { type: Date, default: Date.now() },
        typeLogger: {
          type: String,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
        comment: { type: String },
        dateCreated: { type: Date, default: Date.now() },
        dateUpdated: { type: Date, default: Date.now() },
        state: { type: Boolean, default: true },
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

    share: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
        dateCreated: { type: Date, default: Date.now() },
      },
    ],

    permissionView: {
      type: String,
      enum: ["club", "public", "category", "private"],
      default: "club",
    },

    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// const setImage = (doc) => {

//   if (doc.photos) {
//     const photos = doc.photos.map(element =>
//     `${process.env.BASE_URL}${element}`
//     );
//     doc.photos = photos;
//   }
// }

// PostsModel.post("init", (doc) => {
//   setImage(doc);
// });

// PostsModel.post("save", (doc) => {
//   setImage(doc);
// });

PostsModel.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "_id first_name last_name image -rules",
  });

  next();
});

module.exports = mongoose.model("Posts", PostsModel);
