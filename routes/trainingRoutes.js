const express = require("express");

const {
  createTrainingService,
  getAllTrainings,
  getTrainingByID,
  updateTrainingService,
} = require("../services/trainingService");

const {
  createTrainingValidator,
  updateTrainingValidator,
  getTrainingValidator,
} = require("../utils/validators/TrainingValidator");

const router = express.Router();

router
  .route("/")
  .post(createTrainingValidator, createTrainingService)
  .get(getAllTrainings);

router
  .route("/:id")
  .get(getTrainingValidator, getTrainingByID)
  .put(updateTrainingValidator, updateTrainingService);
module.exports = router;
