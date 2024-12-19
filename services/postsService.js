const AsyncHandler = require("express-async-handler");
const Posts = require("../Models/postsModel");
const handleFacory = require("./handleFactory");
const {
  uploadMultiImages,
  resizeMultiImageMiddleware,
} = require("../middleeware/uploadImageMiddleware");

exports.uploadPostImage = uploadMultiImages(
  "photos",
  1000,
  600,
  "photos",
  "posts",
  "webp",
  70
);

// exports.resizeMultiImage = resizeMultiImageMiddleware(800, 600, "photos", "posts" , 'webp',90);

//create post by created
exports.createPostService = AsyncHandler(async (req, res) => {
  console.log("data sended ===>", req.body);

  const post = await Posts.create({
    createdBy: req.logger,
    imageProfileCreated: req.image,
    nameCreated: req.nameLogger,
    NID: req.NID,
    text: req.body.text,
    photos: req.body.photos,
    videos: req.body.videos,
    location: req.body.location,
    permissionView: req.body.permissionView,
    idClub: req.body.idClub,
    postJoined: req.body.postJoined,
    modelJoined: req.body.modelJoined,
  });

  if (!post) {
    res.status(400).json("Error create new post");
  }

  res.status(200).json({ data: post });
});
//update  post by created
exports.updatePostService = AsyncHandler(async (req, res) => {
  const post = await Posts.findOneAndUpdate(
    {
      createdID: req.logger,
      NID: req.NID,
      _id: req.params.id,
    },
    {
      message: req.body.message,
      photos: req.body.photos,
      videos: req.body.videos,
      permissionView: req.body.permissionView,
    },
    {
      new: true,
    }
  );

  if (!post) {
    res.status(400).json("Error create new post");
  }

  res.status(200).json({ data: post });
});
//remove  post by created
exports.removePostByCreatedService = AsyncHandler(async (req, res) => {
  const post = await Posts.findOneAndDelete({
    createdID: req.logger,
    NID: req.NID,
    state: true,
    _id: req.params.id,
  });

  if (!post) {
    res.status(400).json("Error To Remove this post");
  }

  res.status(200).send();
});

// ================================== //
exports.getAllPostsService = handleFacory.getAll(Posts);

exports.getAllPostsCreatedService = AsyncHandler(async (req, res) => {
  const posts = await Posts.find({
    createdBy: req.logger,
    NID: req.NID,
    state: true,
  }).sort({ createdAt: -1 });

  if (!posts) {
    res.status(400).json("You dont have Post yet");
  }

  res.status(200).json({ results: posts.length, data: posts });
});

exports.getAllPostsClubService = AsyncHandler(async (req, res) => {
  console.log("req.body.idClub", req.params.idClub);
  const posts = await Posts.find({
    idClub: req.params.idClub,
    state: true,
  }).sort({ createdAt: -1 });

  if (!posts) {
    res.status(400).json("You dont have Post yet");
  }

  res.status(200).json({ results: posts.length, data: posts });
});

exports.getDataJoinedToPost = AsyncHandler(async (req, res) => {
  console.log("req.body.idClub", req.body);

  const { listSelect } = req.body;

  const modelName = req.body.model; // Get the model name from the request body
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const Model = require(`../Models/${modelName}`);

  const posts = await Model.find({
    idClub: req.body.idClub,
    state: true,
  })
    .sort({ createdAt: -1 })
    .select(listSelect);

  if (!posts) {
    res.status(400).json("You dont have Post yet");
  }

  res.status(200).json({ results: posts.length, data: posts });
});

exports.getOnePostByCreatedService = AsyncHandler(async (req, res) => {
  const post = await Posts.findOneAndUpdate(
    {
      state: true,
      _id: req.params.id,
    },
    {
      $inc: { views: 1 },
    },
    {
      new: true,
    }
  );

  if (!post) {
    res.status(400).json("This post dont  exist");
  }

  res.status(200).send({ data: post });
});

//////////// Add - update Comment Post//////////////////////
exports.updateCommentPostService = AsyncHandler(async (req, res) => {
  const nid = req.NID ? req.NID : "";
  const { commentID } = req.body;
  const comment = await Posts.findOneAndUpdate(
    {
      _id: req.params.id,
      // comments: { _id: commentID, user: req.logger, NID: nid },
      comments: {
        $elemMatch: {
          _id: commentID,
          user: req.logger,
          NID: nid,
        },
      },
    },
    {
      $set: {
        "comments.$.comment": req.body.comment,
        "comments.$.dateUpdated": Date.now(),
      },
    },

    {
      new: true,
    }
  );

  if (!comment) {
    res.status(400).json("Error update comment");
  }

  res.status(200).json({ data: comment });
});

exports.createCommentPostService = AsyncHandler(async (req, res) => {
  const nid = req.NID ? req.NID : "";
  const comment = await Posts.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $push: {
        comments: {
          NID: nid,
          user: req.logger,
          comment: req.body.comment,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!comment) {
    res.status(400).json("Error create new post");
  }

  res.status(200).json({ data: comment });
});

/////==========> End Comment Post <================= //////////////

//////////// Add - remove Like Post//////////////////////
exports.createlikePostService = AsyncHandler(async (req, res) => {
  const like = await Posts.findByIdAndUpdate(
    {
      _id: req.params.id,
      "likes.user": { $ne: req.logger },
    },
    {
      $push: {
        likes: {
          typeLogger: req.typeLogger,
          user: req.logger,
        },
      },
    },
    {
      new: true,
    }
  ).select("likes");

  if (!like) {
    res.status(400).json("Error create new post");
  }

  res.status(200).json({ data: like });
});

exports.removeLikePostService = AsyncHandler(async (req, res) => {
  const like = await Posts.findOneAndUpdate(
    {
      _id: req.params.id,
      likes: {
        $elemMatch: {
          user: req.logger,
        },
      },
    },
    {
      $pull: {
        likes: { user: req.logger },
      },
    },
    {
      new: true,
    }
  ).select("likes");

  if (!like) {
    res.status(400).json("Error remove like  post");
  }

  res.status(200).json({ data: like });
});

//////////// Add - remove Like Post//////////////////////
exports.updateViews = AsyncHandler(async (req, res) => {
  console.log("req.body.idPost", req.body);

  const userView = {
    user: req.logger,
    typeLogger: req.typeLogger,
  };

  const view = await Posts.findOneAndUpdate(
    {
      _id: req.body.id,
      "whoViews.user": { $ne: req.logger },
    },
    {
      $inc: { views: 1 },
      $addToSet: { whoViews: userView },
    },
    {
      new: true,
    }
  );

  if (!view) {
    const post = await Posts.findByIdAndUpdate(
      req.body.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      res.status(400).json("Error increment view");
    }

    res.status(200).json({ data: post });
  }

  res.status(200).json({ data: view });
});
