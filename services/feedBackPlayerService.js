const AsyncHandler = require("express-async-handler");
const handleFacory = require("./handleFactory");
const feedBackPlayer = require("../Models/feedBackPlayerModel");
const matchModel = require("../Models/matchModel");
const datetimeGenerate = require("../utils/dateTimeGenerate");
const {createNotifications , AllenumActions , AllenumTTitleActions} = require("./noticationService");

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;
  if (req.image) req.body.imageCreator = req.image;
  // if (req.logger) req.body.personn = req.logger;

  next();
});



exports.createFeedBackPlayerService = AsyncHandler(async (req, res) => {

  const playersList = req.body.players;

  const matchName = await matchModel.findById(req.body.matchId).select('opponent matchTime')

  const title = `Match feedback : Vs team <b>${matchName.opponent.toUpperCase()}</b> 
  - [ ${datetimeGenerate(matchName.matchTime)} ]`;
  console.log('data req body ===> ',req.body);
  const feedBack = await feedBackPlayer.create({
    createdBy      : req.logger,
    nameCreator      : req.nameLogger,
    imageCreator      : req.image,
    NID            : req.body.NID,
    title          : title,
    message        : req.body.message,
    players        : playersList,
    idClub         : req.body.idClub,
    category       : req.body.category,
    matchId        : req.body.matchId
  });

  if (!feedBack) {
    throw new Error("Error create new Feedback");
  }

  playersList.forEach(idReceiver => {
    createNotifications(
      {
      idclub : feedBack.idClub ,
      typeAction : AllenumActions.ACTION_FEEDBACK, 
      player : idReceiver,
      imageCreator : req.body.imageCreator,
      nameCreator:  req.nameLogger,
      url : 'url ok ',
      title: AllenumTTitleActions.ACTION_FEEDBACK_SEND,
      text : req.body.message,
      nid :  req.body.NID,
      idAction : feedBack._id,
      actionCreator :  req.logger ,
      typeCreator :  'Personne' }
       
      );
  })

  console.log('after create notification ===> ',AllenumActions);

  
  res.status(200).json({ data: feedBack });
});

exports.getAllFeedBackPlayer = handleFacory.getAll(feedBackPlayer);

exports.getFeedBackPlayerByID = handleFacory.getOne(feedBackPlayer);

exports.getFeedBackPlayerByCreater = AsyncHandler(async (req, res) => {
  const feedBack = await feedBackPlayer.find({
    createdBy: req.logger,
    NID: req.NID,
  });

  if (!feedBack) {
    throw new Error("Not found feedback");
  }

  res.status(200).json({ data: feedBack });
});

exports.updateFeedBackPlayer = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const feedBackUpdate = await feedBackPlayer.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.logger,
    },
    {
      allPlayers: req.body.allPlayers,
      player: req.body.player,
      title: req.body.title,
      message: req.body.message,
    },
    { new: true }
  );

  if (!feedBackUpdate) {
    throw new Error("Error update feedback");
  }

  res.status(200).json({ data: feedBackUpdate });
});

exports.getFeedBackPlayerByPlayer = AsyncHandler(async (req, res) => {
  const feedBack = await feedBackPlayer.find({
    $or: [
      { allPlayers: { $in: [req.logger] } },
      { player: { $in: [req.logger] } },
    ],
    NID: req.NID,
  });

  if (!feedBack) {
    throw new Error("Not found feedback");
  }

  res.status(200).json({ data: feedBack });
});

exports.removeFeedBackPlayerByCreater = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedBack = await feedBackPlayer.findOneAndRemove({
    createdBy: req.logger,
    _id: id,
  });

  if (!feedBack) {
    throw new Error("Not found feedback");
  }

  res.status(200).json({ data: feedBack });
});
