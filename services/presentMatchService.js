const AsyncHandler = require("express-async-handler");
const presentMatchModel = require("../Models/presentMatchModel");
const categoryModel = require("../Models/categoryModel");
const matchModel = require("../Models/matchModel");

const handleFacory = require("./handleFactory");
const datetimeGenerate = require("../utils/dateTimeGenerate");

const {createNotifications , AllenumActions , AllenumTTitleActions} = require("./noticationService");

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;
  // if (req.logger) req.body.personn = req.logger;

  next();
});

exports.createpresentMatchService = AsyncHandler(async (req, res) => {
         

          const sondagePlayer = await presentMatchModel
            .create(req.body);

          if (!sondagePlayer) {
            throw new Error("Error Create Sondage");
          }

          const matchName = await matchModel.findById(sondagePlayer.match).select('opponent matchTime')

          const title = `${AllenumTTitleActions.ACTION_SONDAGE_CREATED} : Vs team <b>${matchName.opponent.toUpperCase()}</b> 
          - [ ${datetimeGenerate(matchName.matchTime)} ]`;

          sondagePlayer.response.forEach(item=> {
            createNotifications(
              {
              idclub : sondagePlayer.idClub ,
              typeAction : AllenumActions.ACTION_SONDAGE, 
              player : item.player,
              imageCreator : req.image,
              nameCreator:  req.nameLogger,
              url : 'url ok ',
              title: title,
              text : req.body.message,
              nid :  req.body.NID,
              idAction : sondagePlayer._id,
              actionCreator :  req.logger ,
              typeCreator :  'Personne' }
               
              );
          })

          res.status(200).json({ data: sondagePlayer });
});

exports.getAllpresentMatchs = handleFacory.getAll(presentMatchModel);

exports.getpresentMatchByID = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const getOne = await presentMatchModel.findOne({
    _id : id,
    NID : req.NID,
    "response.player": req.logger 
    
  });

  if (!getOne) {
    res.status(400).json("This Sondage not Found");
  }

  res.status(200).json({ data: getOne });
});

exports.getpresentMatchByIDForPersonn = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const getOne = await presentMatchModel.findOne({
    _id : id,
    NID : req.NID,
    createdBy: req.logger
   
  });

  if (!getOne) {
    res.status(400).json("This Sondage not Found");
  }

  res.status(200).json({ data: getOne });
});

exports.disactivatepresentMatchByID =
  handleFacory.disactiveOne(presentMatchModel);

exports.updatepresentMatchService = handleFacory.updateByID(presentMatchModel);

exports.getInfoPresentMatch = AsyncHandler(async (req, res) => {
  const { idPresent } = req.params;

  const presentPlayer = await presentMatchModel
    .findOne({
      _id: idPresent,
      // NID: req.NID,
    })
    .select("-response");

  if (!presentPlayer) {
    throw new Error("Error: Not found your info");
  }

  res.status(200).json({ data: presentPlayer });
});

exports.playerResponsePresenet = AsyncHandler(async (req, res) => {
  const { idPresent } = req.params;
  const { present } = req.body;

  const responsePlayer = await presentMatchModel.findOneAndUpdate(
    {
      _id: idPresent,
      NID: req.NID,
      "response.player": req.logger,
    },
    {
      //date
      $set: { "response.$.present": present, "response.$.date": Date.now() },
    },
    { new: true }
  );

  if (!responsePlayer) {
    throw new Error("Error update response player");
  }

  res.status(200).json({ data: responsePlayer });
});


exports.getAllPresentforCoach = AsyncHandler(async (req, res) => {
 
  const categories = await categoryModel.find({
    NID : req.NID,
    coach : { $in: req.logger } ,
    state: 1
  }).select("_id -coach -delege -idClub");

  if (!categories) {
    throw new Error("Error select Sondage");
  }

  const categoryIds = categories.map(category => category._id);

  const Sondage = await presentMatchModel.find({
    NID : req.NID,
    category : { $in: categoryIds } ,
    state: 1
  }).select("_id dateFin messageCoach ");

  res.status(200).json({ data: Sondage });
});
