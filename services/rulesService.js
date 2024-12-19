const AsyncHandler = require("express-async-handler");
const rulesModel = require("../Models/rulesModel");

const handleFacory = require("./handleFactory");

exports.createRulesService = handleFacory.createNew(rulesModel);

exports.getAllRules = AsyncHandler(async (req, res) => {

    const {id} = req.params;
  
    const data = {NID : req.NID , clubId : id};
    console.log(data);  
  
    const rules = await rulesModel.find(data);
  
    if (!rules) {
      res.status(400).json("No available data");
    }

    console.log(rules);
  
    res.status(200).json({ results: rules.length, data: rules });
  });

exports.getRulesByID = handleFacory.getOne(rulesModel);

// exports.disactivateRulesByID = handleFacory.disactiveOne(rulesModel);

exports.updateRulesService = handleFacory.updateByID(rulesModel);
