const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createValidator = [
  check("name")
    .notEmpty()
    .withMessage("This field is required")
    .isLength({ min: 3 })
    .withMessage("This field mustt be gretter then 3 Characters"),
  check("email")
    .notEmpty()
    .withMessage("This field is required")
    .isEmail()
    .withMessage("This email invalid"),
  check("address")
    .notEmpty()
    .withMessage("This field is required")
    .isLength({ min: 3 })
    .withMessage("This field mustt be gretter then 3 Characters"),
  check("phone").notEmpty().withMessage("This field is required"),
  check("stars")
    .optional()
    .isNumeric()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Error Value Stars, min 1 and max 5"),

  validatorMiddlware,
];

exports.getClubValidator = [
  check("id").isMongoId().withMessage("This is invalid"),

  validatorMiddlware,
];

exports.updateClubValidator = [
  check("id").isMongoId().withMessage("This is invalid"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("This field mustt be gretter then 3 Characters"),
  check("email").optional().isEmail().withMessage("This email invalid"),
  check("address")
    .optional()
    .isLength({ min: 3 })
    .withMessage("This field mustt be gretter then 3 Characters"),
  check("phone").optional(),
  validatorMiddlware,
];

exports.disactivateClubValidator = [
  check("id").isMongoId().withMessage("This is invalid"),

  validatorMiddlware,
];

exports.createAdminValidator = [
  check("id").isMongoId().withMessage("This is invalid"),
  check("first_name")
    .notEmpty()
    .withMessage("This field first name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Length first name must be getter then 3 characters"),
  check("last_name")
    .notEmpty()
    .withMessage("This field last name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Length last name must be getter then 3 characters"),
  check("phone")
    .notEmpty()
    .withMessage("This field phone is required")
    .isMobilePhone("ar-MA")
    .withMessage(`This phone number invalid `),
  check("address")
    .notEmpty()
    .withMessage("This field address is required")
    .isLength({ min: 3 })
    .withMessage("Length address must be getter then 3 characters"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("This field confirm Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Length confirm Password must be getter then 3 characters"),
  check("password")
    .notEmpty()
    .withMessage("This field password is required")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Password are not the same ");
      }

      return true;
    }),
  check("gender").notEmpty().withMessage("This field gender is required"),
  check("birthDay").notEmpty().withMessage("This field birthDay is required"),
  check("AFN").notEmpty().withMessage("This field AFN is required"),

  validatorMiddlware,
];
