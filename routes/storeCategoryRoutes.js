const express = require("express");

const authSrvice = require("../services/authService");

const {
  createStoreCategoryService,
  addNIDToRequest,
  getAllCategories,
} = require("../services/storeCategoryService");

const router = express.Router();

router.route("/add-new").post(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  // uploadproductImages,
  // uploadproductImageSlider,
  createStoreCategoryService
);

router.route("/getall/:idClub").get(
  authSrvice.protect,
  addNIDToRequest,
  // authSrvice.allowedTo("admin", "coach"),
  // uploadproductImages,
  // uploadproductImageSlider,
  getAllCategories
);

module.exports = router;
