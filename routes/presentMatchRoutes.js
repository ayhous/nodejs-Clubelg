const express = require("express");

const {
  createpresentMatchService,
  getAllpresentMatchs,
  getpresentMatchByID,
  updatepresentMatchService,
  disactivatepresentMatchByID,
  getInfoPresentMatch,
  playerResponsePresenet,
  getAllPresentforCoach,
  getpresentMatchByIDForPersonn,
  addNIDToRequest
} = require("../services/presentMatchService");

const {
  createPresentMatchValidator,
  updatePresentMatchValidator,
  getPresentMatchValidator,
  deletePresentMatchValidator,
  getInfoPresentMatchValidator,
  putInfoPresentMatchValidator
} = require("../utils/validators/presentMatchValidator");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    // authService.allowedTo("admin", "coach", "manager"),
    addNIDToRequest,
    createPresentMatchValidator,
    createpresentMatchService
  )
  .get(getAllpresentMatchs);

router
  .route("/:id")
  .get(
       authService.protect,
       addNIDToRequest,
       getPresentMatchValidator, 
       getpresentMatchByID)
  .put(
    authService.protect,
    authService.allowedTo("admin", "coach", "manager"),
    updatePresentMatchValidator,
    updatepresentMatchService
  )
  .delete(deletePresentMatchValidator, disactivatepresentMatchByID);

router
  .route("/sondage/for-personn/:id")
  .get(
       authService.protect,
       addNIDToRequest,
       getPresentMatchValidator, 
       getpresentMatchByIDForPersonn);

router
  .route("/player/:idPresent")
  .get(
    authService.protect,
    // authService.allowedTo("player"),
    addNIDToRequest,
    getInfoPresentMatchValidator,
    getInfoPresentMatch
  )
  .put(
    authService.protect,
    // authService.allowedTo("player"),
    addNIDToRequest,
    putInfoPresentMatchValidator,
    playerResponsePresenet
  );


  router
  .route("/coach/all")
  .get(
    authService.protect,
    // authService.allowedTo("player"),
    // getInfoPresentMatchValidator,
    getAllPresentforCoach
  );

module.exports = router;
