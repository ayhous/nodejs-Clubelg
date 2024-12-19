const AsyncHandler = require("express-async-handler");
const actionRulesModel = require("../Models/actionRulesModel");

const handleFacory = require("./handleFactory");


exports.createNewActionRule = AsyncHandler(async (req, res) => {

    const actionRule = await actionRulesModel.create(req.body);
  
    if (!actionRule) {
      res.status(400).json("Error Create new action rule");
    }
  
    res.status(200).json({ data: actionRule });
  });


  exports.getAllActionRule = AsyncHandler(async (req, res) => {

    const actionRule = await actionRulesModel.find();
  
    if (!actionRule) {
      res.status(400).json("Error get all action rule");
    }
  
    res.status(200).json({ data: actionRule });
  });