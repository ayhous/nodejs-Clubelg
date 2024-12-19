const express = require("express");

const authSrvice = require("../services/authService");

const {
  createProductService,
  addNIDToRequest,
  getAllProductsClub,
  getProductsInSlider,
  uploadproductImages,
  uploadproductImageSlider,
  addProductToFavoriteService,
  removeLikePostService,
  removeProductFromFavoriteService,
  getProductByID,
  getproductsByIdCategory,
} = require("../services/storeService");

const router = express.Router();

router.route("/add-new").post(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  uploadproductImages,
  // uploadproductImageSlider,
  createProductService
);

router.route("/:id").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  //   uploadPostImage,
  // resizeMultiImage,
  getAllProductsClub
);

router.route("/slider/:id").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  //   uploadPostImage,
  // resizeMultiImage,
  getProductsInSlider
);

router.route("/detail/:id").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  //   uploadPostImage,
  // resizeMultiImage,
  getProductByID
);

router.route("/:id/:idCategory").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  //   uploadPostImage,
  // resizeMultiImage,
  getproductsByIdCategory
);

//add remove like and
router
  .route("/add-to-favorite/:id")
  .post(authSrvice.protect, addProductToFavoriteService)
  .delete(authSrvice.protect, removeProductFromFavoriteService);

module.exports = router;
