const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const playerModel = require("../Models/playerModel");
const personnModel = require("../Models/personnelModel");

exports.protect = AsyncHandler(async (req, res, next) => {
  let token;

  console.log("token", req.headers.authorization);
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new Error("You aree not login, please login to enter this page");
  }

  const decode = jwt.verify(token, process.env.BCRYPT);
  let logger;

  if (decode.rule === "Personne") {
    logger = await personnModel.findById(decode.loggerID);
  } else {
    logger = await playerModel.findById(decode.loggerID);
  }

  if (!logger) {
    throw new Error("This Logger not exist");
  }
  //   console.log("**********************************", logger.paswordChangedAt);

  if (logger.paswordChangedAt) {
    const passChangeTimesTamp = parseInt(
      logger.paswordChangedAt.getTime() / 1000,
      10
    );
    // console.log("**********************************", passChangeTimesTamp);
    if (passChangeTimesTamp > decode.iat) {
      throw new Error("Your are receenly change password, please login again");
    }
  }

  req.logger = logger._id;
  req.nameLogger = `${logger.first_name} ${logger.last_name}`;
  req.rules = logger.rules;
  req.typeLogger = decode.rule;
  req.NID = logger.NID;
  req.image = decode.image ? decode.image : "";
  // req.email = logger.email;

  if (logger.category) req.category = logger.category;

  next();
});

exports.allowedTo = (...roles) =>
  AsyncHandler(async (req, res, next) => {
    // console.log(roles);

    if (!req.rules) {
      throw new Error("You dont have permission");
    }
    //['admin','manager']
    if (!roles.some((role) => req.rules.includes(role))) {
      throw new Error("You dont have permission");
    }

    next();
  });
