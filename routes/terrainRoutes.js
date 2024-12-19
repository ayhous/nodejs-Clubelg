const express = require("express");

const {
  createTerrainService,
  getAllTerrains,
  getTerrainByID,
  updateTerrainService,
} = require("../services/terrainService");

const {
  createTerrainValidator,
} = require("../utils/validators/terrainValidator");

const router = express.Router();

router
  .route("/")
  .post(createTerrainValidator, createTerrainService)
  .get(getAllTerrains);

router.route("/:id").get(getTerrainByID).put(updateTerrainService);
module.exports = router;
