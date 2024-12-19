const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createMatchValidator = [
  check("opponent")
    .notEmpty()
    .withMessage("This field opponent is required")
    .isLength({ min: 3 })
    .withMessage("Length opponent must be getter then 3 characters"),
  check("Season")
    .isMongoId()
    .withMessage("This id invalid")
    .notEmpty()
    .withMessage("This field Season is required"),
  check("category")
    .isMongoId()
    .notEmpty()
    .withMessage("This field phone is required"),
  check("addressMatch")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Length address must be getter then 3 characters"),
  check("in_out").notEmpty().withMessage("This field in out is required"),
  check("matchTime")
    .notEmpty()
    .withMessage("This field match time is required"),
  check("images")
    .optional()
    .isArray({ max: 4 })
    .withMessage("Max images is '4' "),

  validatorMiddlware,
];

exports.getMatchByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.diactiveMatchByIDValiator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.updateMatchValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("opponent")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Length opponent must be getter then 3 characters"),
  check("Season")
    .optional()
    .notEmpty()
    .withMessage("This field Season is required"),
  check("category").optional().isMongoId().withMessage("This category invalid"),
  check("addressMatch")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Length address must be getter then 3 characters"),

  validatorMiddlware,
];
