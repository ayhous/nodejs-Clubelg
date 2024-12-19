const express = require("express");

const {
  createRulesService,
  getAllRules,
  getRulesByID,
  updateRulesService,
} = require("../services/rulesService");

const {
  createRuleValidator,
  getRuleValidator,
  updateRuleValidator,
} = require("../utils/validators/rulesValidator");

const authSrvice = require("../services/authService");

const router = express.Router();

router
  .route("/")
  // .get(getAllRules)
  .post(
    authSrvice.protect,
    // authSrvice.allowedTo("superAdmin"),
    createRuleValidator,
    createRulesService
  );

  router
  .route("/allRulesByClub/:id")
  .get(authSrvice.protect,getAllRules);

router
  .route("/:id")
  .get(getRuleValidator, getRulesByID)
  .put(
    authSrvice.protect,
    authSrvice.allowedTo("superAdmin"),
    updateRuleValidator,
    updateRulesService
  );

module.exports = router;
