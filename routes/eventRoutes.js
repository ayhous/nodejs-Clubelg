const express = require("express");

const {
  createeventService,
  getAllevents,
  getEventByID,
  addNIDToRequest,
  participeEvent,
  removeParticipieFormEvent,
} = require("../services/eventService");

const {
  createEvenValidator,
  getEventIDValidator,
} = require("../utils/validators/eventValidator");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authSrvice.protect,
    authSrvice.allowedTo("admin"),
    addNIDToRequest,
    createEvenValidator,
    createeventService
  )
  .get(authSrvice.protect, authSrvice.allowedTo("admin"), getAllevents);

router
  .route("/:id")
  .get(
    authSrvice.protect,
    authSrvice.allowedTo("user", "player", "admin", "manager", "coach"),
    getEventIDValidator,
    getEventByID
  )
  .post(
    authSrvice.protect,
    authSrvice.allowedTo("user", "player", "admin", "manager", "coach"),
    // getEventIDValidator,
    participeEvent
  )
  .delete(
    authSrvice.protect,
    authSrvice.allowedTo("user", "player", "admin", "manager", "coach"),
    getEventIDValidator,
    removeParticipieFormEvent
  );
module.exports = router;
