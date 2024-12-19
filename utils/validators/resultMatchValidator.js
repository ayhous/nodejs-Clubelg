const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");
const resultMatchModel = require("../../Models/resultMatchModel");

exports.createResultMatchValidator = [
  check("match")
    .notEmpty()
    .withMessage("This field date Season is required ")
    .isMongoId()
    .withMessage("This match invalid ")
    .custom((val, { req }) =>  
      resultMatchModel.findOne({ match: val }).then((data) => {
        if (!data) {

           resultMatchModel.create(
            {
              match : val,
              NID : req.NID,
              idClub : req.body.idClub,

            }).then((dataO) => {
            console.log('Error =====> ', dataO)
           });
           

        }
      })
    ),
    
  check("goalInfoA")
    .optional(),
  check("goalInfoB")
    .optional()
    .isArray()
    .withMessage("This field must be Array"),
  check("cardYellow")
    .optional()
    .isArray()
    .withMessage("This field must be Array"),
  check("cardRed").optional().isArray().withMessage("This field must be Array"),

  validatorMiddlware,
];

exports.createReplacePlayerValidate = [
  check("match")
    .notEmpty()
    .withMessage("This field date Season is required ")
    .isMongoId()
    .withMessage("This match invalid ")
    .custom((val, { req }) =>  
      resultMatchModel.findOne({ match: val }).then((data) => {
        if (!data) {

           resultMatchModel.create(
            {
              match : val,
              NID : req.NID,
              idClub : req.body.idClub,

            }).then((dataO) => {
            console.log('Error =====> ', dataO)
           });
           

        }
      })
    ),
    
  validatorMiddlware,
];


exports.updateResultMatchValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  check("match").optional().isMongoId().withMessage("This match invalid "),
  check("author").optional().isMongoId().withMessage("This match invalid "),
  check("goalInfoA")
    .optional()
    .isArray()
    .withMessage("This field must be Array"),
  check("goalInfoB")
    .optional()
    .isArray()
    .withMessage("This field must be Array"),
  check("cardYellow")
    .optional()
    .isArray()
    .withMessage("This field must be Array"),
  check("cardRed").optional().isArray().withMessage("This field must be Array"),

  validatorMiddlware,
];

exports.getResultMatchByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];

exports.deleteResultMatchByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];
