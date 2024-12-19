const express = require("express");

const {
  getAllresultMatchs,
  getresultMatchByID,
  updateresultMatchService,
  disactivateresultMatchByID,
  deleteGoal,
  deleteRedCard,
  deleteYellowCard,
  updateGoal,
  updateRedCard,
  updateYellowCard,
  addGoalToMatch,
  replacePlayerMatch,
  addCardToMatch
} = require("../services/resultMatchService");

const {
  createResultMatchValidator,
  getResultMatchByIDValidator,
  updateResultMatchValidator,
  deleteResultMatchByIDValidator,
  createReplacePlayerValidate
} = require("../utils/validators/resultMatchValidator");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

//here delete goal - red card  - yellow car
router.route("/:resultID/deleteGoal/:deleteID").delete(deleteGoal);
router.route("/:resultID/deleteRedCard/:deleteID").delete(deleteRedCard);
router.route("/:resultID/deleteYellowCard/:deleteID").delete(deleteYellowCard);

//here update goal - red card  - yellow car
router.route("/:resultID/updateGoal/:deleteID").put(updateGoal);
router.route("/:resultID/updateRedCard/:deleteID").put(updateRedCard);
router.route("/:resultID/updateyellowCard/:deleteID").put(updateYellowCard);

router
  .route("/")
  .get(getAllresultMatchs);

router
  .route("/add/goal")
  .post(
    authService.protect,
    // authService.allowedTo("admin", "coach"),
    createResultMatchValidator,
    addGoalToMatch
  );

router
  .route("/add/card")
  .post(
    authService.protect,
    // authService.allowedTo("admin", "coach"),
    // createResultMatchValidator,
    addCardToMatch
  );

router
  .route("/add/replace-player")
  .post(
    authService.protect,
    // authService.allowedTo("admin", "coach"),
    createReplacePlayerValidate,
    replacePlayerMatch
  );

router
  .route("/:id")
  .get(getResultMatchByIDValidator, getresultMatchByID)
  .put(updateResultMatchValidator, updateresultMatchService)
  .delete(deleteResultMatchByIDValidator, disactivateresultMatchByID);
module.exports = router;
