const express = require("express");

const {
  createPlayerValidator,
  getPlayerByIDValidator,
  deletePlayerByIDValiator,
  updatePlayerValidator,
  changePasswordValidator,
  loginPlayerValidator,
  forgotPassordPlayerValidator,
  resetPasswordWithCodeValidator,
  isValidCodeForgotPassValidator,
} = require("../utils/validators/playerValidator");

const {
  createPlayerService,
  getAllPlayers,
  getPlayerByID,
  disactivatePlayerByID,
  updatePlayerService,
  uploadSingleImage,
  resizeImage,
  activeEmail,
  changePasswordService,
  loginService,
  forgotPasswordService,
  isValidCodeForgotPass,
  resetPasswordWithCode,
  addNIDToRequest,
  getPlayerByIDCategory,
} = require("../services/playerService");

const authService = require("../services/authService");
const { generateRandomAFN } = require("../services/handleFactory");

const router = express.Router();

router.get("/aciveEmail/:id", getPlayerByIDValidator, activeEmail);
router.put(
  "/changePassword",
  authService.protect,
  changePasswordValidator,
  changePasswordService
);

router.post("/login/player", loginPlayerValidator, loginService);
router.post(
  "/forgotPasword",
  forgotPassordPlayerValidator,
  forgotPasswordService
);
router
  .route("/resset-password/:code")
  .get(isValidCodeForgotPassValidator, isValidCodeForgotPass)
  .post(resetPasswordWithCodeValidator, resetPasswordWithCode);

router
  .route("/")
  .post(
    authService.protect,
    // authService.allowedTo("admin"),
    uploadSingleImage,
    // resizeImage,
    generateRandomAFN,
    addNIDToRequest,
    // createPlayerValidator,
    createPlayerService
  )
  .get(getAllPlayers);

router
  .route("/:id")
  .get(authService.protect, getPlayerByIDValidator, getPlayerByID)
  .delete(deletePlayerByIDValiator, disactivatePlayerByID)
  .put(
    authService.protect,
    authService.allowedTo("player", "admin"),
    updatePlayerValidator,
    updatePlayerService
  );

router.route("/category/:id").get(
  authService.protect,
  // getPlayerByIDValidator,
  getPlayerByIDCategory
);

module.exports = router;
