const { check } = require("express-validator");
const selectedTeamModel = require("../../Models/selectedTeamModel");

const validatorMiddlware = require("../../middleeware/validatorMiddleware");

exports.createSelectedTeamValidator = [
  check("match")
    .notEmpty()
    .withMessage("This field Selected Team is required ")
    .isMongoId()
    .withMessage("This field id invalid"),
  check("players")
    .notEmpty()
    .withMessage("This field player is required ")
    .isMongoId()
    .withMessage("This field id invalid")
    .custom((val, { req }) =>
      selectedTeamModel
        .find({ match: req.body.match })
        .select("player -_id")
        .then((m) => {
          const idMaches = [];

          m.forEach((matchID) => {
            idMaches.push(matchID.player.toString());
          });

          if (idMaches.includes(val)) {
            return Promise.reject(
              new Error(`This player already exist in this selection `)
            );
          }
        })
    ),


  validatorMiddlware,
];

exports.updateSelectedTeamValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  // check("match").optional().isMongoId().withMessage("This field match invalid"),
  check("player")
    .isMongoId()
    .withMessage("This field player invalid")
    .custom((val, { req }) =>
      selectedTeamModel
        .findOne({ match: req.params.id })
        .select("players -_id")
        .then((m) => {
          // console.log("=========> not players", m.players);
          // m.players.forEach((matchID) => {
          //   // idMaches.push(matchID.player.toString());
          //   // if (val.toString() === matchID.player.toString()) {
          //   //   throw new Error(`This player already exist in this selection `);
          //   // }
          //   console.log("=========>foreach matchID ", matchID);
          // });
          // if (idMaches.includes(val)) {
          //   return Promise.reject(
          //     new Error(`This player already exist in this selection `)
          //   );
          // }
        })
    ),
  validatorMiddlware,
];

exports.getSelectedTeamByIDValidator = [
  check("id").isMongoId().withMessage("This id invalid"),
  validatorMiddlware,
];
