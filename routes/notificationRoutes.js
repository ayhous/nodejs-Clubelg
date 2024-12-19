const express = require("express");

const authSrvice = require("../services/authService");

const {
    addNIDToRequest,
    getNotificationsByIdCreated,
    getNotificationsByReceiver,
    getNotificationsByReceiverNotVue,
    updateNotificationToVue
  } = require("../services/noticationService");

const router = express.Router();


// router
//   .route("/")
//   .post(
//     authSrvice.protect,
//     addNIDToRequest,

//   )

router
  .route("/personn")
  .get(
    authSrvice.protect,
    addNIDToRequest,
    getNotificationsByIdCreated);
router
  .route("/receiver")
  .get(
    authSrvice.protect,
    addNIDToRequest,
    getNotificationsByReceiver
    );

router
    .route("/not-vue")
    .get(
      authSrvice.protect,
      addNIDToRequest,
      getNotificationsByReceiverNotVue
      );

router
    .route("/to-vue")
    .put(
      authSrvice.protect,
      addNIDToRequest,
      updateNotificationToVue
      );
module.exports = router;