const express = require("express");

const {
  createFeedBackPlayerService,
  getAllFeedBackPlayer,
  getFeedBackPlayerByID,
  getFeedBackPlayerByCreater,
  getFeedBackPlayerByPlayer,
  updateFeedBackPlayer,
  removeFeedBackPlayerByCreater,
  addNIDToRequest
} = require("../services/feedBackPlayerService");

const {
  createFeedBackPlayerValidator,
  updateFeedBackPlayerByIDValidator,
  getFeedBackPlayerByIDValidator,
  deleteFeedBackPlayerByIDValidator,
} = require("../utils/validators/feedBackPlayerValidator");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authSrvice.protect,
    addNIDToRequest,
    createFeedBackPlayerValidator,
    createFeedBackPlayerService
  )
  .get(authSrvice.protect,
    //  authSrvice.allowedTo("admin"),
      getAllFeedBackPlayer);

router
  .route("/:id")
  .put(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "manager", "coach"),
    updateFeedBackPlayerByIDValidator,
    updateFeedBackPlayer
  )
  .get(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "manager", "coach"),
    getFeedBackPlayerByIDValidator,
    getFeedBackPlayerByID
  )
  .delete(
    authSrvice.protect,
    authSrvice.allowedTo("admin", "manager", "coach"),
    deleteFeedBackPlayerByIDValidator,
    removeFeedBackPlayerByCreater
  );

router
  .route("/creater/feed")
  .get(
    authSrvice.protect,
    authSrvice.allowedTo("admin", "manager", "coach"),
    getFeedBackPlayerByCreater
  );

router
  .route("/player/feed")
  .get(
    authSrvice.protect,
    authSrvice.allowedTo("player"),
    getFeedBackPlayerByPlayer
  );
module.exports = router;
