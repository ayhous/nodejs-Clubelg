const AsyncHandler = require("express-async-handler");
const engagmentModel = require("../Models/engagmentModel");
const playerModel = require("../Models/playerModel");

const handleFacory = require("./handleFactory");

exports.createEngagmentService = handleFacory.createNew(engagmentModel);

exports.getAllEngagments = handleFacory.getAll(engagmentModel);

exports.getEngagmentByID = handleFacory.getOne(engagmentModel);

// exports.disactivateEngagmentByID = handleFacory.disactiveOne(engagmentModel);

exports.updateEngagmentService = handleFacory.updateByID(engagmentModel);

exports.getPlayersByCategory = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  //here ge all engaement by id category and NID , but just return player field
  const paidPlayersIds = await engagmentModel
    .find({
      category: id,
      NID: req.NID,
      typePayment: { $exists: true },
    })
    .distinct("player");

  // Trouver les joueurs de la catégorie qui n'ont pas payé
  //here we return just playres not exist in field engagment, thats main this player not pay
  const nonPaidPlayers = await playerModel.find({
    category: id,
    NID: req.NID,
    _id: { $nin: paidPlayersIds },
  });

  res.status(200).json({ totla: nonPaidPlayers.length, data: nonPaidPlayers });
});
