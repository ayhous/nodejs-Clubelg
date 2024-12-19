const express = require("express");


const { addFollower,
        addNIDToRequest,
        unFollower,
        getFollowersLogger }  = require ("../services/followerService");

const authSrvice = require("../services/authService");


  const router = express.Router();




router
  .route("/")
  .post(
    authSrvice.protect,
    addNIDToRequest,
    // createEvenValidator,
    addFollower
  ).get(
    authSrvice.protect,
    addNIDToRequest,
    getFollowersLogger
  );

  router
  .route("/unfollow")
  .post(
    authSrvice.protect,
    addNIDToRequest,
    // createEvenValidator,
    unFollower);


  router
  .route("/:id").get(
    authSrvice.protect,
    addNIDToRequest,
    getFollowersLogger
  );


  module.exports = router;
