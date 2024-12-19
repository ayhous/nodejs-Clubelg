const express = require("express");

const {
  createCategoryService,
  getAllCategoriesService,
  getcatgoryByIDService,
  updateCategoryService,
  disactivateCategoryByIDService,
  uploadSingleImage,
  // resizeImage,
  addNIDToRequest,
  getCatgoriesByClubId,
} = require("../services/categoryService");

const {
  createCategoryValidator,
  disactivateCategoryValidator,
  updateCategoryValidator,
  getCategoryValidator,
} = require("../utils/validators/categoryValidator");

const authSrvice = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("admin"),
    uploadSingleImage,
    // resizeImage,
    addNIDToRequest,
    createCategoryValidator,
    createCategoryService
  )
  .get(
    authSrvice.protect,
    // authSrvice.allowedTo("admin"),
    getAllCategoriesService
  );

router.route("/all-categories/:id").get(
  authSrvice.protect,
  addNIDToRequest,
  // getCategoryValidator,
  getCatgoriesByClubId
);

router
  .route("/:id")
  .get(getCategoryValidator, getcatgoryByIDService)
  .put(
    authSrvice.protect,
    authSrvice.allowedTo("admin"),
    uploadSingleImage,
    // resizeImage,
    updateCategoryValidator,
    updateCategoryService
  )
  .delete(
    authSrvice.protect,
    authSrvice.allowedTo("admin"),
    disactivateCategoryValidator,
    disactivateCategoryByIDService
  );

module.exports = router;
