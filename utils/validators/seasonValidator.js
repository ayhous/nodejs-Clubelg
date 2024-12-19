const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createSeasonValidator = [
  check("dateSeason")
    .notEmpty()
    .withMessage("This field date Season is required "),
  validatorMiddlware,
];

exports.updateSeasonValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("dateSeason").optional(),
  validatorMiddlware,
];

exports.getSeasonByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];
