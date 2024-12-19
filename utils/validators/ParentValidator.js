const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createParentValidator = [
  check("first_name")
    .notEmpty()
    .withMessage("This field first name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Length first name must be getter then 3 characters"),
  check("last_name")
    .notEmpty()
    .withMessage("This field last name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Length last name must be getter then 3 characters"),
  check("phone").notEmpty().withMessage("This field phone is required"),
  check("address")
    .notEmpty()
    .withMessage("This field address is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Length address must be getter then 3 characters"),

  validatorMiddlware,
];

exports.getParentByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.deleteParentByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.updateParentValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("first_name")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Length first name must be getter then 3 characters"),
  check("last_name")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Length last name must be getter then 3 characters"),
  check("phone").optional(),
  check("address")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Length address must be getter then 3 characters"),
  check("gender").optional(),
  check("birthDay").optional(),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Length address must be getter then 3 characters"),

  validatorMiddlware,
];
