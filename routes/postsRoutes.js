const express = require("express");

const {
  createPostService,
  getAllPostsService,
  getAllPostsCreatedService,
  removePostByCreatedService,
  getOnePostByCreatedService,
  createCommentPostService,
  createlikePostService,
  removeLikePostService,
  updatePostService,
  updateCommentPostService,
  uploadPostImage,
  resizeMultiImage,
  getAllPostsClubService,
  updateViews,
  getDataJoinedToPost,
} = require("../services/postsService");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "coach"),
    uploadPostImage,
    // resizeMultiImage,
    createPostService
  )
  .get(authSrvice.protect, getAllPostsService);

router
  .route("/:id")
  .put(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "coach"),
    updatePostService
  )
  .get(authSrvice.protect, getOnePostByCreatedService)
  .delete(authSrvice.protect, removePostByCreatedService);

//get all posts created
router.get("/posts/created", authSrvice.protect, getAllPostsCreatedService);

//get all posts created by club
router.get(
  "/posts/created/club/:idClub",
  authSrvice.protect,
  getAllPostsClubService
);

//add - update comment
router
  .route("/comment/:id")
  .post(authSrvice.protect, createCommentPostService)
  .put(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "coach"),
    updateCommentPostService
  )
  .get(authSrvice.protect, getOnePostByCreatedService)
  .delete(authSrvice.protect, removePostByCreatedService);

//add remove like and
router
  .route("/like/:id")
  .post(authSrvice.protect, createlikePostService)
  .delete(authSrvice.protect, removeLikePostService);

router.route("/views/update").post(authSrvice.protect, updateViews);

router.route("/get-joined-post").post(authSrvice.protect, getDataJoinedToPost);

module.exports = router;
