const AsyncHandler = require("express-async-handler");
const categoryModel = require("../Models/categoryModel");
const handleFacory = require("./handleFactory");
const {
  uploadMultiImages,
  resizeImageMiddleware,
} = require("../middleeware/uploadImageMiddleware");

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;

  next();
});

// exports.uploadSingleImage = uploadSingleImage("image");

exports.uploadSingleImage = uploadMultiImages(
  "image",
  800,
  600,
  "image",
  "categories",
  "webp",
  90,
  false
);

exports.resizeImage = resizeImageMiddleware(
  360,
  200,
  "image",
  "categories",
  "webp",
  90,
  false
);

exports.createCategoryService = handleFacory.createNew(categoryModel);

exports.getAllCategoriesService = handleFacory.getAll(categoryModel);

exports.getcatgoryByIDService = handleFacory.getOne(categoryModel);

exports.updateCategoryService = handleFacory.updateByID(categoryModel);

exports.getCatgoriesByClubId = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const getCategories = await categoryModel
    .find({
      idClub: id,
      NID: req.body.NID,
    })
    .sort({ createdAt: -1 });

  if (!getCategories) {
    res.status(400).json("No available getOne");
  }

  res.status(200).json({ data: getCategories });
});

exports.disactivateCategoryByIDService =
  handleFacory.disactiveOne(categoryModel);

//http://localhost:3001/api/v1/club/6576d6e1c4977e0b37c8d50c/category
