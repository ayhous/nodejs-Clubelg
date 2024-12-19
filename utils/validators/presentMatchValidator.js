const { check } = require("express-validator");
const matchModel = require("../../Models/matchModel");
const playrModel = require("../../Models/playerModel");
const presentMatchModel = require("../../Models/presentMatchModel");
const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createPresentMatchValidator = [
  check("dateFin").notEmpty().withMessage("This field date fin is required"),
  check("match")
    .notEmpty()
    .withMessage("This field  is required")
    .isMongoId()
    .withMessage("This match invalid")

    .custom(async (val, { req }) => {
      const category = await matchModel
        .findOne({ _id: val, NID: req.NID })
        .select("category -_id");

      if (!category) {
        throw new Error(`This id Category is not Found `);
      }

      const player = await playrModel
        .find({
          category: category.category,
          NID: req.NID,
        })
        .select("_id");

      if (!player) {
        throw new Error(`This player is not Found `);
      }

      const playerArray = [];

      player.forEach((playerID) => {
        playerArray.push({ player: playerID._id });
      });

      console.log("=======> category", playerArray);

      req.body.response = playerArray;
      req.body.createdBy = req.logger;
    }),

  check("messageCoach")
    .optional()
    .isLength({ min: 10 })
    .withMessage("This field message coach must be gretten than 3 characters"),

  validatorMiddlware,
];

exports.updatePresentMatchValidator = [
  check("id").isMongoId().withMessage("This present match invalid"),
  check("dateFin").optional(),
  check("match").optional().isMongoId().withMessage("This match invalid"),
  check("response")
    .optional()
    .isArray()
    .withMessage("This field response must be Array"),
  check("messageCoach")
    .optional()
    .isLength({ min: 10 })
    .withMessage("This field message coach must be gretten than 3 characters"),

  validatorMiddlware,
];

exports.getPresentMatchValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];

exports.deletePresentMatchValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];

exports.getInfoPresentMatchValidator = [
  check("idPresent")
    .isMongoId()
    .withMessage("This id not valid")
    .custom(async (val, { req }) => {
      // const { idPresent } = req.params.idPresent;

      const present = await presentMatchModel.find({
        _id: val,
        NID: req.NID,
        response: { $in: { player: req.logger } },
      });

      if (!present) {
        throw new Error("Error exist player");
      }
    }),

  validatorMiddlware,
];

exports.putInfoPresentMatchValidator = [
  check("idPresent")
    .isMongoId()
    .withMessage("This id not valid")
    .custom(async (val, { req }) => {
      // const { idPresent } = req.params.idPresent;

      const present = await presentMatchModel.find({
        _id: val,
        NID: req.NID,
        response: { $in: { player: req.logger } },
      });

      if (!present) {
        throw new Error("Error exist player");
      }
    }),
  check("present").notEmpty().withMessage("Plaese check present"),

  validatorMiddlware,
];
