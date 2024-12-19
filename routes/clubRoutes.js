const express = require("express");

const {
  getClubValidator,
  updateClubValidator,
  disactivateClubValidator,
  createAdminValidator,
} = require("../utils/validators/clubValidator");

const {
  createClub,
  getAllClubs,
  getAllClubsNearby,
  getClubByID,
  updateClub,
  disactivateClubByID,
  uploadClubImage,
  resizeImage,
  addNIDToRequest,
  activeClubByEmail,
  createAdminClub,
  getAllClubsByNID,
  addImageCover,
  updateImageCover,
  removeImageCoverById,
  findClub,
  uploadClubImageCover,
  resizeImageCover,
} = require("../services/clubService");

const { generateRandomAFN } = require("../services/handleFactory");

const categoryRoute = require("./categoryRoutes");

const matchRoute = require("./matchRoutes");

const authSrvice = require("../services/authService");

const router = express.Router();

router.use("/:nid/catgory", categoryRoute);
router.use("/:nid/match", matchRoute);
// router.use("/:nid/player", categoryRoute);

router
  .route("/active/:id")
  .get(activeClubByEmail)
  .post(generateRandomAFN, createAdminValidator, createAdminClub);

router
  .route("/clubsUser")
  .get(authSrvice.protect, addNIDToRequest, getAllClubsByNID);

router.route("/add-image-cover").put(
  authSrvice.protect,
  addNIDToRequest,
  uploadClubImageCover,
  // resizeImageCover,
  addNIDToRequest,
  addImageCover
);

router
  .route("/update-image-cover")
  .put(authSrvice.protect, addNIDToRequest, updateImageCover);

router
  .route("/remove-image-cover")
  .put(authSrvice.protect, addNIDToRequest, removeImageCoverById);

router
  .route("/")
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("superAdmin"),
    addNIDToRequest,
    uploadClubImage,
    // resizeImage,
    // addNIDToRequest,
    // createVsalidator,
    createClub
  )
  .get(getAllClubs);

router.route("/all/nearby").get(getAllClubsNearby);

router.route("/search/:nameClub").get(authSrvice.protect, findClub);

router
  .route("/:id")
  .get(getClubValidator, getClubByID)
  .put(
    authSrvice.protect,
    authSrvice.allowedTo("superAdmin", "admin"),
    updateClubValidator,
    updateClub
  )
  .delete(
    authSrvice.protect,
    authSrvice.allowedTo("superAdmin"),
    disactivateClubValidator,
    disactivateClubByID
  );

module.exports = router;
