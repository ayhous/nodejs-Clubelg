const express = require("express");
const {
  deleteValidator,
  updateValidator,
  createPersonnValidator,
  createPersonnAdminClubValidator,
  checkIsID,
  checkEmailAndPass,
  changePasswordValidator,
  isValidCodeForgotPassValidator,
  resetPasswordWithCodeValidator,
  forgotPassordPlayerValidator,
} = require("../utils/validators/personnValidator");
const {
  createPersonn,
  deletePersonn,
  getAllPersonn,
  getPersonnByID,
  updatePersonnByID,
  uploadSingleImage,
  resizeImage,
  activeEmail,
  login,
  changePasswordService,
  forgotPasswordService,
  isValidCodeForgotPass,
  resetPasswordWithCode,
  addNIDToRequest,
  createAdminClub,
  CreateNIDToRequest,
  updatePersonnByAdmin,
  verfiyCodeOTP,
  updateImageProfile,
  verifyCodeResetPass,
  changePasswordNewPerson,
  resendCodeOTP,
} = require("../services/personnService");

const { generateRandomAFN } = require("../services/handleFactory");

const router = express.Router();

const authService = require("../services/authService");

router.get("/activeEmail/:id", checkIsID, activeEmail);

router
  .route("/login/personn")
  .post(forgotPassordPlayerValidator, checkEmailAndPass, login);

router.route("/image-profile").put(
  authService.protect,
  addNIDToRequest,
  uploadSingleImage,
  // resizeImage,
  updateImageProfile
);

router
  .route("/changePassword")
  .put(
    authService.protect,
    authService.allowedTo("user", "admin"),
    changePasswordValidator,
    changePasswordService
  );

router.route("/forgotPasword").post(forgotPasswordService);
router.route("/verifyCodeResetPass").post(verifyCodeResetPass);

router
  .route("/resset-password")
  // .get(isValidCodeForgotPassValidator, isValidCodeForgotPass)
  .post(resetPasswordWithCodeValidator, resetPasswordWithCode);

router
  .route("/changePasswordNewPerson")
  // .get(isValidCodeForgotPassValidator, isValidCodeForgotPass)
  .post(authService.protect, changePasswordNewPerson);

router.route("/").get(authService.protect, getAllPersonn).post(
  authService.protect,
  // authService.allowedTo("admin"),
  uploadSingleImage,
  // resizeImage,
  generateRandomAFN,
  addNIDToRequest,
  createPersonnValidator,
  createPersonn
);

router
  .route("/createAdminClub")
  .post(
    generateRandomAFN,
    CreateNIDToRequest,
    createPersonnAdminClubValidator,
    createAdminClub
  );

router.route("/verifyCodeOTP").post(authService.protect, verfiyCodeOTP);

router.route("/resendCodeOTP").post(authService.protect, resendCodeOTP);
router.route("/staffs/:idClub").get(authService.protect, getAllPersonn);

router
  .route("/:id")
  .delete(authService.protect, authService.allowedTo("admin"), deletePersonn)
  .get(deleteValidator, getPersonnByID)
  .put(
    authService.protect,
    authService.allowedTo("admin", "user"),
    updateValidator,
    updatePersonnByID
  );

router
  .route("/admin/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    deleteValidator,
    getPersonnByID
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    addNIDToRequest,
    updatePersonnByAdmin
  );

module.exports = router;
