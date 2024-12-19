const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createEngagmentValidator = [
  check("player")
    .notEmpty()
    .withMessage("This field Engagment is required ")
    .isMongoId()
    .withMessage("This field player invalid"),
  check("category")
    .notEmpty()
    .withMessage("This field Engagment is required ")
    .isMongoId()
    .withMessage("This field player invalid"),
  check("season")
    .notEmpty()
    .withMessage("This field Engagment is required ")
    .isMongoId()
    .withMessage("This field player invalid"),
  check("typePayment")
    .optional()
    .isString()
    .withMessage("This field type Payment is required "),
  check("description")
    .optional()
    .isString()
    .withMessage("This field type Payment is required "),
  validatorMiddlware,
];

exports.updateEngagmentValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("player")
    .optional()
    .isMongoId()
    .withMessage("This field player invalid"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("This field player invalid"),
  check("season")
    .optional()
    .isMongoId()
    .withMessage("This field player invalid"),
  validatorMiddlware,
];

exports.getEngagmentByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];
