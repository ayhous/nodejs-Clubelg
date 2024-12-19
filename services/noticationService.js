const asyncHandler = require("express-async-handler");
const notificationModel = require("../Models/notificationsModel");


exports.addNIDToRequest = asyncHandler(async (req, res, next) => {
    if (req.NID) req.body.NID = req.NID;
    // if (req.logger) req.body.personn = req.logger;
  
    next();
  });

const enumActions = {
    ACTION_FEEDBACK: 'feedback',
    ACTION_SONDAGE: 'sondage',
    ACTION_MATCH: 'match'
};

const enumTitleActions = {
  ACTION_FEEDBACK_SEND: 'Message Feedback',
  ACTION_FEEDBACK_UPDATE: 'Update Message Feedback',

  ACTION_MATCH_CREATED: 'Create new match',

  ACTION_SONDAGE_CREATED: 'Match Sondage created ',
  ACTION_SONDAGE_ACCEPT: 'Accepted the match'
};

exports.AllenumActions       = Object.freeze(enumActions);
exports.AllenumTTitleActions = Object.freeze(enumTitleActions);

exports.createNotifications = async ({idclub, typeAction, 
                                     player, imageCreator ,nameCreator, url , text ,title, 
                                     nid , idAction , actionCreator, 
                                     
                                     typeCreator = 'Personne'}) => {

       await notificationModel.create(
        {
          idClub        : idclub,
          NID           : nid,
          typeAction    : typeAction,
          player        : player,
          url           : url,
          title         : title,
          text          : text,
          idAction      : idAction,
          nameCreator   : nameCreator,
          actionCreator : actionCreator,
          typeCreator   : typeCreator,
          imageCreator  : imageCreator
        }
      );

  };


const returnArrayEnum =  Object.values(enumActions);  

exports.getNotificationsByIdCreated = asyncHandler(async (req, res) => {
    const limitData       = req.query.limit;
    const skipData        = req.query.skip;
    const typeActionData  = req.query.typeAction;

    console.log('limit data ===> ', parseInt(limitData, 10));

    const query = {
      actionCreator : req.logger,
      NID : req.body.NID,
    }

    if(typeActionData){
      query.typeAction  = typeActionData

    }

    const notifications = await notificationModel.find(query)
                          .sort({ createdAt: -1 })
                          .limit(parseInt(limitData, 10))
                          .skip(parseInt(skipData, 10));

    if (!notifications) {
        res.status(400).json("No notification available");
      }

      console.log('notifications', notifications)

    res.status(200).json({ data: notifications , length : notifications.length,  action : returnArrayEnum });

});

exports.getNotificationsByReceiver = asyncHandler(async (req, res) => {
  const limitData       = req.query.limit  ? req.query.limit : 10;
  const skipData        = req.query.skip   ? req.query.skip  : 0;
  const typeActionData  = req.query.typeAction;

  const query = {
    player : req.logger,
    NID : req.body.NID,
  }

  console.log('query ===> ', query);

  if(typeActionData){
    query.typeAction  = typeActionData

  }
  
  const notifications = await notificationModel.find(query).sort({ createdAt: -1 })
  .limit(parseInt(limitData, 10))
  .skip(parseInt(skipData, 10));
  ;

  if (!notifications) {
      res.status(400).json("No notification available");
    }

  res.status(200).json({ data: notifications , action : returnArrayEnum , length : notifications.length  });

});

exports.getNotificationsByReceiverNotVue = asyncHandler(async (req, res) => {
  
    const notifications = await notificationModel.find({
        player : req.logger,
        NID : req.body.NID,
        vue : 0
    }).sort({ createdAt: -1 });

    if (!notifications) {
        res.status(400).json("No notification available");
    }

    res.status(200).json({ data: notifications , action : returnArrayEnum , length : notifications.length });

});

exports.updateNotificationToVue = asyncHandler(async (req, res) => {
  
  const {idNotification} = req.body;

  console.log('====> body noti', req.body);

  await notificationModel.findByIdAndUpdate({
    _id : idNotification
  }, 
  {
    vue : 1,
    timeVue : Date.now()
  }
);


});


//   module.exports = notifications;