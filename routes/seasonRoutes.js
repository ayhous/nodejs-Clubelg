const express = require("express");

const {
  createSeasonService,
  getAllSeasons,
  getSeasonByID,
  updateSeasonService,
} = require("../services/seasonService");

const {
  createSeasonValidator,
  getSeasonByIDValidator,
  updateSeasonValidator,
} = require("../utils/validators/seasonValidator");

const router = express.Router();

router
  .route("/")
  .post(createSeasonValidator, createSeasonService)
  .get(getAllSeasons);

router
  .route("/:id")
  .get(getSeasonByIDValidator, getSeasonByID)
  .put(updateSeasonValidator, updateSeasonService);
module.exports = router;
