const express = require("express");

const selectedTeam = require("./selectedTeamRoutes");
const resultMatch = require("./resultMatchRoutes");
const presentMatch = require("./presentMatchRoutes");

const {
  createMatchValidator,
  getMatchByIDValidator,
  diactiveMatchByIDValiator,
  updateMatchValidator,
} = require("../utils/validators/matchValidator");

const {
  createMatchService,
  getAllMatchService,
  deleteMatchService,
  getMatchByIDService,
  updateMatchByID,
  getAllMediasMatch,
  resizeMultiImageMiddleware,
  addNIDToRequest,
  matchesByClubId,
  matchesByCategoryId,
  matchesAddNotofication,
  startMatch,
  uploadImageMatch,
  uploadMatchImage,
  resizeMatchImage,
} = require("../services/matchService");

const authSrvice = require("../services/authService");

const router = express.Router();

router.use("/:id/selectedTeam", selectedTeam);
router.use("/:id/resultMatch", resultMatch);
router.use("/:id/presentMatch", presentMatch);

router
  .route("/")
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("admin", "manager", "coach"),
    // uploadMultiImages,
    // resizeMultiImageMiddleware,
    addNIDToRequest,
    // createMatchValidator,
    createMatchService
  )
  .get(getAllMatchService);

router
  .route("/:id")
  .put(
    authSrvice.protect,
    authSrvice.allowedTo("admin", "manager", "coach"),
    // uploadMultiImages,
    resizeMultiImageMiddleware,
    updateMatchValidator,
    updateMatchByID
  )
  .get(getMatchByIDValidator, getMatchByIDService)
  .delete(
    authSrvice.protect,
    authSrvice.allowedTo("admin", "manager", "coach"),
    diactiveMatchByIDValiator,
    deleteMatchService
  );

router.route("/notification/add").post(
  authSrvice.protect,
  // authSrvice.allowedTo("admin", "manager", "coach"),
  // uploadMultiImages,
  // resizeMultiImageMiddleware,
  addNIDToRequest,
  // createMatchValidator,
  matchesAddNotofication
);

router.route("/startMatch").post(
  authSrvice.protect,
  // authSrvice.allowedTo("admin", "manager", "coach"),
  // uploadMultiImages,
  // resizeMultiImageMiddleware,
  addNIDToRequest,
  // createMatchValidator,
  startMatch
);

router.route("/media/add").post(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "manager", "coach"),
  uploadMatchImage,
  // resizeMatchImage,

  // createMatchValidator,
  uploadImageMatch
);

router.route("/media/get/:id").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "manager", "coach"),
  // createMatchValidator,
  getAllMediasMatch
);

router.route("/club/:clubId").get(matchesByClubId);

router.route("/category/:categoryId").get(matchesByCategoryId);

module.exports = router;
