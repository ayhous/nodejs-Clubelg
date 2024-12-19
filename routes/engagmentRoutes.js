const express = require("express");

const {
  createEngagmentService,
  getAllEngagments,
  getEngagmentByID,
  updateEngagmentService,
  getPlayersByCategory,
} = require("../services/engagmentService");

const {
  createEngagmentValidator,
  getEngagmentByIDValidator,
  updateEngagmentValidator,
} = require("../utils/validators/engagmentValidator");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authSrvice.protect,
    authSrvice.allowedTo("admin"),
    createEngagmentValidator,
    createEngagmentService
  )
  .get(authSrvice.protect, authSrvice.allowedTo("admin"), getAllEngagments);

router
  .route("/:id")
  .get(getEngagmentByIDValidator, getEngagmentByID)
  .put(
    authSrvice.protect,
    authSrvice.allowedTo("admin"),
    updateEngagmentValidator,
    updateEngagmentService
  );

//get player from category

router
  .route("/player/:id")
  .get(authSrvice.protect, authSrvice.allowedTo("admin"), getPlayersByCategory);

module.exports = router;
