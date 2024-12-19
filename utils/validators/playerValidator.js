const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createPlayerValidator = [
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
  check("gender").notEmpty().withMessage("This field gender is required"),
  check("birthDay").notEmpty().withMessage("This field birthDay is required"),
  check("category").notEmpty().withMessage("This field category is required"),
  check("AFN").notEmpty().withMessage("This field AFN is required"),
  check("NID").notEmpty().withMessage("This field NID is required"),

  validatorMiddlware,
];

exports.getPlayerByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.deletePlayerByIDValiator = [
  check("id").isMongoId().withMessage("This id invalid"),

  validatorMiddlware,
];

exports.updatePlayerValidator = [
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
    .isLength({ min: 3 })
    .withMessage("Length address must be getter then 3 characters"),
  check("gender").optional(),
  check("birthDay").optional(),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Length address must be getter then 3 characters"),

  validatorMiddlware,
];

exports.changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("This field password required"),
  check("ConfirmNewPassword")
    .notEmpty()
    .withMessage("This field confirm new password required"),
  check("newPassword")
    .notEmpty()
    .withMessage("This field conform new password required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 0,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      "Password must be : [ 1 UPPERCASE, 1 lowercase, 1 Number] at lest"
    )
    .custom((val, { req }) => {
      if (val !== req.body.ConfirmNewPassword) {
        throw new Error("Password are not the same ");
      }

      return true;
    }),

  validatorMiddlware,
];

exports.loginPlayerValidator = [
  check("email")
    .notEmpty()
    .withMessage("This field email is required")
    .isEmail()
    .withMessage("This email invalid"),
  check("password").notEmpty().withMessage("This field pasword is required"),
  validatorMiddlware,
];

exports.forgotPassordPlayerValidator = [
  check("email")
    .notEmpty()
    .withMessage("This field email is required")
    .isEmail()
    .withMessage("This email invalid"),
  validatorMiddlware,
];

exports.isValidCodeForgotPassValidator = [
  check("code")
    .notEmpty()
    .withMessage("This field confirm Password is required"),
  validatorMiddlware,
];

exports.resetPasswordWithCodeValidator = [
  check("id")
    .notEmpty()
    .withMessage("This field id player is required")
    .isMongoId()
    .withMessage("This id not connect"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("This field confirm Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 0,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      "Password must be : [ 1 UPPERCASE, 1 lowercase, 1 Number] at lest"
    ),
  check("password")
    .notEmpty()
    .withMessage("This field password is required")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Password are not the same ");
      }

      return true;
    }),
  check("code")
    .notEmpty()
    .withMessage("This field confirm Password is required"),
  validatorMiddlware,
];
