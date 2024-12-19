const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createRuleValidator = [
  check("name")
    .notEmpty()
    .withMessage("This field namee rule is required")
    .isLength({ min: 3 })
    .withMessage("This field name ruls msut be gretter then 3 characters"),

  validatorMiddlware,
];

exports.getRuleValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];

exports.updateRuleValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("name")
    .notEmpty()
    .withMessage("This field namee rule is required")
    .isLength({ min: 3 })
    .withMessage("This field name ruls msut be gretter then 3 characters"),

  validatorMiddlware,
];
