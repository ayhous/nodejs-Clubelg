const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createTerrainValidator = [
  check("NID").notEmpty().withMessage("This field NID is required "),
  check("name")
    .notEmpty()
    .withMessage("This field category is required ")
    .isLength({ min: 3 })
    .withMessage("This fiel name terrain must be gritter then 3 characters"),

  validatorMiddlware,
];
