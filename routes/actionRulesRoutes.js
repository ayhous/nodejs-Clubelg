const express = require("express");

const {
    createNewActionRule,
    getAllActionRule
} = require("../services/actionRulesService");

// const {
//   createRuleValidator,
// } = require("../utils/validators/action");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getAllActionRule)
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("superAdmin"),
    // createRuleValidator,
    createNewActionRule
  );


  module.exports = router;