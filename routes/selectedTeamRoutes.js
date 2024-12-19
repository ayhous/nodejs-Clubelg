const express = require("express");

const {
  createselectedTeamService,
  getAllselectedTeams,
  getselectedTeamByID,
  updateselectedTeamService,
} = require("../services/selectedTeamService");

const {
  createSelectedTeamValidator,
  getSelectedTeamByIDValidator,
  updateSelectedTeamValidator,
} = require("../utils/validators/selectedTeamValidator");

const authSrvice = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "manager", "coach"),
    // createSelectedTeamValidator,
    createselectedTeamService
  )
  .get(getAllselectedTeams);

router
  .route("/:id")
  .get(getSelectedTeamByIDValidator, getselectedTeamByID)
  .put(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "manager", "coach"),
    // updateSelectedTeamValidator,
    updateselectedTeamService
  );

module.exports = router;
