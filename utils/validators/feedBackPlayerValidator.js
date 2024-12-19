/* eslint-disable no-lonely-if */
const { check } = require("express-validator");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");
const feedBackPlayerModel = require("../../Models/feedBackPlayerModel");


exports.createFeedBackPlayerValidator = [
 
  check("matchId")
      .isMongoId()
      .withMessage("This matchId id invalid"),
    
  check("category").isMongoId().withMessage("This category id invalid"),
  
  validatorMiddlware,
];

exports.getFeedBackPlayerByIDValidator = [
  check("id").isMongoId().withMessage("This is invalid"),
  validatorMiddlware,
];

exports.deleteFeedBackPlayerByIDValidator = [
  check("id")
    .isMongoId()
    .withMessage("This id is invalid")
    .custom(async (val, { req }) => {
      const { NID, logger } = req;

      const feedBack = await feedBackPlayerModel.findOne({
        _id: val,
        NID: NID,
        createdBy: logger,
      });

      if (!feedBack) {
        throw new Error(`You dont have permisssion to delete this feedback`);
      }
    }),

  validatorMiddlware,
];

exports.updateFeedBackPlayerByIDValidator = [
  check("id")
    .isMongoId()
    .withMessage("This is invalid")
    .custom(async (val, { req }) => {
      const { NID, logger } = req;

      const feedBack = await feedBackPlayerModel.findOne({
        _id: val,
        NID: NID,
        createdBy: logger,
      });

      if (!feedBack) {
        throw new Error(`You dont have permisssion to update this feedback`);
      }
    }),
  check("allPlayers")
    .optional()
    .isArray()
    .withMessage("This Field allPlayers is invalid"),
  check("player")
    .optional()
    .isArray()
    .withMessage("This Field player is invalid"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("This field title is required")
    .isLength({ min: 2 })
    .withMessage("This field title must be gretter then 2 characters"),
  check("message")
    .optional()
    .notEmpty()
    .withMessage("This field message is required")
    .isLength({ min: 10 })
    .withMessage("This field message must be gretter then 10 characters"),

  validatorMiddlware,
];
