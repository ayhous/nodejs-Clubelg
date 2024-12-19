const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createTrainingValidator = [
  check("NID").notEmpty().withMessage("This field NID is required "),
  check("category")
    .notEmpty()
    .withMessage("This field category is required ")
    .isMongoId()
    .withMessage("This field id invalid"),
  check("dayTraining")
    .notEmpty()
    .withMessage("This field category is required ")
    .isArray()
    .withMessage("This field day training invalid"),
  check("terraing")
    .optional()
    .isMongoId()
    .withMessage("This field terraing invalid"),

  validatorMiddlware,
];

exports.updateTrainingValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("category").optional().isMongoId().withMessage("This field id invalid"),
  check("dayTraining")
    .optional()
    .isArray()
    .withMessage("This field day training invalid"),
  check("terraing")
    .optional()
    .isMongoId()
    .withMessage("This field terraing invalid"),

  validatorMiddlware,
];

exports.getTrainingValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];
