const AsyncHandler = require("express-async-handler");
const selectedTeamModel = require("../Models/selectedTeamModel");
const handleFacory = require("./handleFactory");

exports.createselectedTeamService = handleFacory.createNew(selectedTeamModel);

exports.getAllselectedTeams = handleFacory.getAll(selectedTeamModel);

exports.getselectedTeamByID = handleFacory.getOne(selectedTeamModel);

exports.disactivateselectedTeamByID =
  handleFacory.disactiveOne(selectedTeamModel);

// exports.updateselectedTeamService = handleFacory.updateByID(selectedTeamModel);
exports.updateselectedTeamService = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const selectTeam = await selectedTeamModel.findOneAndUpdate(
    { 
      match: id,
      NID: req.NID,
      idClub : req.body.idClub,
      idSondage : req.body.idSondage,
    },
    {
      // $set: { "response.$.present": present, "response.$.date": Date.now() },
      players : req.body.players,
    },
    {
      new: true,
    }
  );

  if (!selectTeam) {
    throw new Error("Error");
  }
  res.status(200).json({ data: selectTeam });
});
