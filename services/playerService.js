/* eslint-disable import/no-extraneous-dependencies */
const AsyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const playerModel = require("../Models/playerModel");
const handleFacory = require("./handleFactory");
const sendMail = require("../utils/sendEmail");
const {
  uploadMultiImages,
  resizeImageMiddleware,
} = require("../middleeware/uploadImageMiddleware");

// exports.uploadSingleImage = uploadSingleImage("image");

exports.uploadSingleImage = uploadMultiImages(
  "image",
  800,
  600,
  "image",
  "players",
  "webp",
  90,
  false
);

exports.resizeImage = resizeImageMiddleware(
  140,
  140,
  "image",
  "players",
  "webp",
  80,
  false
);

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;

  next();
});

exports.createPlayerService = AsyncHandler(async (req, res) => {
  // const data = req.body;

  const createNew = await playerModel.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    NID: req.body.NID,
    AFN: req.body.AFN,
    image: req.body.image,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    birthDay: req.body.birthDay,
    parent: req.body.parent,
    category: req.body.category,
  });

  if (!createNew) {
    res.status(400).json("Error create new data");
  }

  // send email to active
  // await sendMail({
  //   email: req.body.email,
  //   subject: "Welcome To Clubelg",
  //   message: `
  //   <div style="text-align:center;">
  //     Hi Dear ${req.body.first_name} ${req.body.first_name} <br> <br>
  //     Welcome to <b style="background-color:grey;color:black;font-size:16px;">Clubelg</b>
  //     <br><br>
  //     Please Active you Email to click
  //      <a href='' style="background-color:blue;color:white;font-size:16px;padding:10px;text-align:center;">
  //      Click here</a>

  //      </div>
  //   `,
  // });

  res.status(200).json({ message: "please active you email", data: createNew });
});

exports.getAllPlayers = handleFacory.getAll(playerModel);

exports.getPlayerByID = handleFacory.getOne(playerModel);

exports.getPlayerByIDCategory = AsyncHandler(async (req, res) => {
  const idCategory = req.params.id;

  const players = await playerModel.find({
    category: idCategory,
  });

  if (!players) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ data: players });
});

exports.disactivatePlayerByID = handleFacory.disactiveOne(playerModel);

exports.updatePlayerService = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  let { body } = req;
  if (req.rules.includes("player") || !req.rules) {
    body = {
      image: req.body.image,
      email: req.body.email,
    };
  }

  console.log(body);

  const data = await playerModel.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });

  if (!data) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ data: data });
});

// function acive email => /aciveEmail/id player
exports.activeEmail = handleFacory.activeEmail(playerModel);

//change passowrd => is login
exports.changePasswordService = handleFacory.changePassowrd(playerModel);

//login
exports.loginService = handleFacory.login(playerModel, "player");

//forgot password
exports.forgotPasswordService = handleFacory.forgotPassword(playerModel);

//send link reset password

//here check if code valid before show form reset password
exports.isValidCodeForgotPass = handleFacory.isValidCode(playerModel);

//here after logger click link in email, and initialize new password
exports.resetPasswordWithCode = handleFacory.resetPasswordWithCode(playerModel);
