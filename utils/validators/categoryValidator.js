const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");
const categoryModel = require("../../Models/categoryModel");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("This field name is required")
    .isLength({ min: 2 })
    .withMessage("This field name must be gretter then 2 characters")
    .custom((val, { req }) =>
      categoryModel.findOne({ name: val, idClub: req.body.idClub }).then((data) => {
        if (data) {
          return Promise.reject(new Error("This name Category is eexist"));
        }
      })
    ),
  // check("coach").optional().isArray().withMessage("This field is Array"),
  // check("delege").optional().isArray().withMessage("This field is Array"),

  check("NID").notEmpty().withMessage("This field name is required"),

  check("priceInscription")
    .notEmpty()
    .withMessage("This field price inscription is required")
    .isNumeric()
    .withMessage("This field price must be number"),

  validatorMiddlware,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("This is invalid"),

  validatorMiddlware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("This is invalid"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("This field mustt be gretter then 3 Characters"),
  check("NID").optional(),
  check("coach").optional().isArray().withMessage("This field is Array"),
  check("delege").optional().isArray().withMessage("This field is Array"),
  check("priceInscription").optional(),
  validatorMiddlware,
];

exports.disactivateCategoryValidator = [
  check("id").isMongoId().withMessage("This is invalid"),

  validatorMiddlware,
];
