/* eslint-disable no-use-before-define */
const AsyncHandler = require("express-async-handler");
const resultMatch = require("../Models/resultMatchModel");

const handleFacory = require("./handleFactory");

exports.addGoalToMatch = AsyncHandler(async (req, res) => {

    const ourOrOpponent = req.body.ourOrOpponent === 'our' ? 'goalInfoA' : 'goalInfoB';

    const getCategories = await resultMatch.findOneAndUpdate(
      {
        idClub : req.body.idClub,
        NID    : req.NID,
        match  : req.body.match
        
      },
      {
        $addToSet : {
          [ourOrOpponent] : {
              goalPlayer : req.body.goalInfoA.goalPlayer !== '' ? req.body.goalInfoA.goalPlayer : null,
              goalAssist : req.body.goalInfoA.goalAssist !== '' ? req.body.goalInfoA.goalAssist : null,
              time   : req.body.goalInfoA.goalTime   !== '' ? req.body.goalInfoA.goalTime   : null,
              createdBy  : req.logger
            
            } 
        },
      },
      {
        new: true,
      }
    ).sort({ createdAt: -1 });

    if (!getCategories) {
      res.status(400).json("No available getOne");
    }

    res.status(200).json({ data: getCategories });

});

exports.addCardToMatch = AsyncHandler(async (req, res) => {
  const getCategories = await resultMatch.findOneAndUpdate(
    {
      idClub : req.body.idClub,
      NID    : req.NID,
      match  : req.body.match
      
    },
    {
      $addToSet : {
        card : {
            player     : req.body.card.playerSelect !== '' ? req.body.card.playerSelect : null,
            type       : req.body.card.typeCard     !== '' ? req.body.card.typeCard     : null,
            time   : req.body.card.timeCard     !== '' ? req.body.card.timeCard     : null,
            icon       : req.body.card.typeCard     !== '' ? req.body.card.typeCard     : null,
            createdBy  : req.logger
          
          } 
      },
    },
    {
      new: true,
    }
  ).sort({ createdAt: -1 });

  if (!getCategories) {
    res.status(400).json("No available getOne");
  }

  res.status(200).json({ data: getCategories });

});

exports.replacePlayerMatch = AsyncHandler(async (req, res) => {

  const player = await resultMatch.findOneAndUpdate(
    {
      idClub : req.body.idClub,
      NID    : req.NID,
      match  : req.body.match
      
    },
    {
      $addToSet : {
        change : {
            player_out   : req.body.change.playerOut !== '' ? req.body.change.playerOut : null,
            player_in    : req.body.change.playerIn  !== '' ? req.body.change.playerIn  : null,
            time         : req.body.change.time      !== '' ? req.body.change.time      : null,
            createdBy    : req.logger
          } 
      },
    },
    {
      new: true,
    }
  ).sort({ createdAt: -1 });

  if (!player) {
    res.status(400).json("No available");
  }

  res.status(200).json({ data: player });

});


exports.getAllresultMatchs = handleFacory.getAll(resultMatch);

exports.getresultMatchByID = handleFacory.getOne(resultMatch);

exports.disactivateresultMatchByID = handleFacory.disactiveOne(resultMatch);

exports.updateresultMatchService = handleFacory.updateByID(resultMatch);

// eslint-disable-next-line no-use-before-define
exports.deleteGoal = handleFacory.deleteFromResultMatch(
  resultMatch,
  "goalInfoA"
);

exports.deleteRedCard = handleFacory.deleteFromResultMatch(
  resultMatch,
  "cardRed"
);

exports.deleteYellowCard = handleFacory.deleteFromResultMatch(
  resultMatch,
  "cardYellow"
);

exports.updateGoal = handleFacory.deleteFromResultMatch(
  resultMatch,
  "goalInfoA"
);

exports.updateRedCard = handleFacory.deleteFromResultMatch(
  resultMatch,
  "cardRed"
);

exports.updateYellowCard = handleFacory.deleteFromResultMatch(
  resultMatch,
  "cardYellow"
);
