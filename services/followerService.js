const AsyncHanler = require("express-async-handler");
const personnelModel = require("../Models/personnelModel");
const clubModel = require("../Models/clubModel");



exports.addNIDToRequest = AsyncHanler(async (req, res, next) => {
  
    req.body.NID = req.NID;
    next();
  });

exports.addFollower = AsyncHanler(async (req, res) => {

    const data = req.body;
    console.log(data);

    let typeModel = "";

    if(data.type){

      switch (data.type) {
        case "Club":
          typeModel = clubModel
          break;
        case "Personn":
          typeModel = personnelModel
          break;
        default:
          break;
      }

    }
  
    const addFollower = await typeModel.findOneAndUpdate(
      {
        _id : req.body.idFollower,
        'followers.idFollower': { $ne: req.logger }
      },
      {
        $push: {
          followers: {
            typeLogger : req.typeLogger,
            idFollower: req.logger,
            dateSendFollower: Date.now()
          },
        },
      },
      {
        new: true,
      }

    ).select("_id followers");
  
    if (!addFollower) {
      return res.status(404).json({ error: "Error To add follower" });
    }
  
    res.status(200).json({ data: addFollower });
  });

exports.unFollower = AsyncHanler(async (req, res) => {

    const data = req.body;
    console.log(data);

    let typeModel = "";

    if(data.type){

      switch (data.type) {
        case "Club":
          typeModel = clubModel
          break;
        case "Personn":
          typeModel = personnelModel
          break;
        default:
          break;
      }

    }
  
    const unFollower = await typeModel.findOneAndUpdate(
      {
        _id : req.body.idFollower,
        'followers.idFollower': req.logger 
      },
      {
        $pull: {
          followers: {
            idFollower: req.logger
          },
        },
      },
      {
        new: true,
      }

    ).select("_id followers");
  
    if (!unFollower) {
      return res.status(404).json({ error: "Error To  unfollow" });
    }
  
    res.status(200).json({ data: unFollower });
  });


  
  exports.getFollowersLogger = AsyncHanler(async (req, res) => {

      const followers = await personnelModel.findById(req.params.id).select('followers -rules');

      if (!followers) {
        return res.status(404).json({ error: "Error To get follower" });
      }
    
      res.status(200).json({ data: followers.followers });
  });