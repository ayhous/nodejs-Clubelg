const { check } = require("express-validator");
// const validator = require("validator");
const validatorMiddlware = require("../../middleeware/validatorMiddleware");

const eventModel = require("../../Models/eventModel");
const categoryModel = require("../../Models/categoryModel");
const playerModel = require("../../Models/playerModel");

exports.createEvenValidator = [
  check("nameEvent")
    .notEmpty()
    .withMessage("This field name event is required")
    .isLength({ min: 6 })
    .withMessage("This field name event must be gretter then 6 characters"),
  check("personn").notEmpty().withMessage("This field name event is required"),
  check("category")
    .isMongoId()
    .withMessage("This field category is invalid")
    .notEmpty()
    .withMessage("This field date event is required"),
  check("text").notEmpty().withMessage("This field date event is required"),
  check("dateEvent")
    .notEmpty()
    .withMessage("This field date event is required")
    .custom((val) => {
      const dateEnter = new Date(val);
      const dateNow = new Date();
      if (dateEnter < dateNow) {
        throw new Error("This date not correct, please select valid date");
      }

      return true;
    }),

  validatorMiddlware,
];

exports.getEventIDValidator = [
  check("id")
    .isMongoId()
    .withMessage("This event invalid")
    .custom(async (val, { req }) => {
      const event = await eventModel.findById(val);
      console.log("==========>", event.dateEvent);
      const dateNow = new Date();
      const eventDate = new Date(event.dateEvent);
      console.log("==========> dateNow", dateNow);
      console.log("==========> eventDate", eventDate);
      if (eventDate < dateNow) {
        throw new Error("This date not correct, please select valid date");
      }

      console.log("====> Rule personn ", req.rules);
      if (!req.rules.includes("admin") && !req.rules.includes("player")) {
        if (!req.rules.some((rule) => event.personn.includes(rule))) {
          throw new Error("You havent permission to enter this event");
        }
      }

      console.log("====> Rule player ", req.rules);
      if (req.rules.includes("player")) {
        if (!event.category.includes(req.category)) {
          throw new Error(
            "This player dont have permission to enter this event"
          );
        }
      }

      return true;
    }),

  validatorMiddlware,
];
