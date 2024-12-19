/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
const ObjectId = require("mongoose");

const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomize = require("randomatic");
const fs = require("fs");
const { env } = require("process");
const sendMail = require("../utils/sendEmail");
const generateVerificationCode = require("../utils/verificationCode");

const resultMatch = require("../Models/resultMatchModel");
const selectedTeamModel = require("../Models/selectedTeamModel");
const playerModel = require("../Models/playerModel");

const {
  createNotifications,
  AllenumActions,
  AllenumTTitleActions,
} = require("./noticationService");

exports.disactiveOne = (model) =>
  AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const disactive = await model.findByIdAndUpdate(
      { _id: id },
      { state: 0 },
      { new: true }
    );

    if (!disactive) {
      res.status(400).json(`This ${model} is not Found`);
    }

    res.status(204).json("Success");
  });

exports.createNew = (model, param = "") =>
  AsyncHandler(async (req, res) => {
    try {
      if (req.NID) req.body.NID = req.NID;
      if (req.logger) req.body.createdBy = req.logger;
      // if(req.body.idClub) req.body.idClub = ObjectId(req.body.idClub);

      const coach = [];
      const delege = [];

      if (req.body.coach) {
        const coachArray = req.body.coach.split(",");

        coachArray.forEach((co) => {
          coach.push(co);
        });

        req.body.coach = coach;
      }

      if (req.body.delege) {
        const delegeArray = req.body.delege.split(",");

        delegeArray.forEach((co) => {
          delege.push(co);
        });

        req.body.delege = delege;
      }

      const data = req.body;

      console.log("data  ======>", data);

      const createNew = await model.create(data);

      if (param === "matchs") {
        await resultMatch.create({
          match: createNew._id,
          NID: createNew.NID,
        });

        await selectedTeamModel.create({
          match: createNew._id,
          NID: createNew.NID,
        });

        const playersList = await playerModel
          .find({
            category: req.body.category,
            NID: req.NID,
            state: 1,
          })
          .select("_id");

        playersList.forEach((idReceiver) => {
          createNotifications({
            idclub: req.body.idClub,
            typeAction: AllenumActions.ACTION_MATCH,
            player: idReceiver,
            imageCreator: req.image,
            title: AllenumTTitleActions.ACTION_MATCH_CREATED,
            text: "match amical created ...",
            nid: req.body.NID,
            idAction: createNew._id,
            actionCreator: req.logger,
            typeCreator: "Personne",
          });
        });
      }

      if (!createNew) {
        res.status(400).json("Error create new data");
      }

      res.status(200).json({ message: "ok", data: createNew });
    } catch (e) {
      throw new Error("Error create new data");
    }
  });

exports.getAll = (model) =>
  AsyncHandler(async (req, res) => {
    let NID = { state: 1 };
    if (req.params.nid) NID = { NID: req.params.nid, state: 1 };
    if (req.params.id) NID = { match: req.params.id, state: 1 };
    if (req.NID) NID = { NID: req.NID };
    if (req.query.category)
      NID = {
        NID: req.NID,
        category: ObjectId.Types.ObjectId(req.query.category),
      };

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const data = await model.find(NID).limit(limit).skip(skip);

    if (!data) {
      res.status(400).json("No available data");
    }

    res.status(200).json({ results: data.length, data: data });
  });

exports.getOne = (model) =>
  AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const getOne = await model.findById(id);

    if (!getOne) {
      res.status(400).json("No available getOne");
    }

    res.status(200).json({ data: getOne });
  });

//"categories/1702492408753-266412755.jpeg"
exports.updateByID = (model) =>
  AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    const data = await model.findByIdAndUpdate({ _id: id }, body, {
      new: false,
    });

    if (!data) {
      res.status(400).json("No available data");
    }

    if (req.body.image) {
      const imagePAth = data.image.split("/").slice(3, 5).join("/");
      if (fs.existsSync(`uploads/${imagePAth}`)) {
        fs.unlinkSync(`uploads/${imagePAth}`);
      }
    }

    res.status(200).json({ data: data });
  });

exports.login = (model, rule) =>
  AsyncHandler(async (req, res, next) => {
    const logger = await model.findOne({ email: req.body.email });

    if (!logger) {
      res.status(401).json({ error: "This Account dont exist" });
      // throw new Error("This Account dont exist");
    }

    console.log("logger  ====> ", logger);

    const passCorrect = await bcrypt.compare(
      req.body.password,
      logger.password
    );
    if (!passCorrect) {
      // throw new Error("Passord or email is not correct");
      res.status(401).json({ error: "Password or email is not correct !!!" });
    }

    const token = generateToken(logger, rule, logger.changePass_after_created);

    if (!logger.changePass_after_created) {
      if (logger.emailActive === 0) {
        this.logger = await model.findByIdAndUpdate(
          logger._id,
          { emailActive: 1 },
          {
            new: true,
          }
        );

        this.token = generateToken(
          logger,
          rule,
          logger.changePass_after_created
        );
      }

      res
        .status(200)
        .json({ token, data: logger, changePass_after_created: false });
    }

    res.status(200).json({ token, data: logger });
  });

exports.changePassowrd = (model) =>
  AsyncHandler(async (req, res) => {
    const currentPass = req.body.currentPassword;
    const newPass = req.body.newPassword;

    const logger = await model.findById(req.logger);
    if (!logger) {
      throw new Error("This ACcount dont exist");
    }

    const passCorrect = await bcrypt.compare(currentPass, logger.password);

    if (!passCorrect) {
      throw new Error("This password is not correct");
    }

    const passwordHash = await bcrypt.hash(newPass.toString(), 12);

    const updatePass = await model.findByIdAndUpdate(logger._id, {
      password: passwordHash,
      passwordActive: 1,
      paswordChangedAt: Date.now(),
    });

    const subject = "Your Password has been changed";
    const message = ` Hi Dear <b>${updatePass.first_name} ${updatePass.last_name}</b>
       <br>. Your password is changed,
       <br>
       Thinks 

       <br><br>
       Update date => <p style="background-color:blue;color:white;font-size:16px;font-weight:bold;"> 
       ${updatePass.updatedAt}
              </p>
       `;
    await sendMail({
      email: updatePass.email,
      subject: subject,
      message: message,
    });

    const token = generateToken(logger);

    res.status(200).json({ token, msg: updatePass });
  });

const generateToken = (logger, rule, changePass = null) =>
  jwt.sign(
    {
      loggerID: logger._id,
      email: logger.email,
      rule: rule,
      changePass_after_created: changePass,
      // eslint-disable-next-line prefer-template
      name: logger.first_name + " " + logger.last_name,
      NID: logger.NID,
      image: logger.image,
      category: logger.category,
    },
    process.env.BCRYPT,
    {
      expiresIn: process.env.EXPERID_TOKEN,
    }
  );

exports.forgotPassword = (model) =>
  AsyncHandler(async (req, res) => {
    console.log(req.body.email);
    const logger = await model.findOne({ email: req.body.email });

    if (!logger) {
      throw new Error("This Account dont exist !!!");
    }

    // const generatedCode = Math.floor(10000000000 + Math.random() * 90000000000);
    const code = generateVerificationCode();

    const MAX_TIME_EXPIRE = Date.now() + 3 * 60 * 1000;

    await model.findByIdAndUpdate(logger._id, {
      codeForgotPassword: code,
    });
    let routeType;
    // eslint-disable-next-line no-unused-expressions
    logger.rules.includes("player")
      ? (routeType = "player")
      : (routeType = "personn");

    //send To email 12840588042
    const subject = `Reset passWord -  ${process.env.nameClub}`;
    const message = ` Hi Dear ${logger.first_name} ${logger.last_name}
       <br>. Please Reset  your passWord
       <br>
            Code To reset password: <b> ${code} </b>
             <br>
       `;
    await sendMail({
      email: logger.email,
      subject: subject,
      message: message,
    });

    res.status(200).json({ email: logger.email });
  });

exports.verifyCodeResetPass = (model) =>
  AsyncHandler(async (req, res) => {
    const logger = await model.findOne({
      email: req.body.email,
      codeForgotPassword: req.body.code,
    });

    if (!logger) {
      throw new Error("This Account dont exist !!!");
    }

    res.status(200).json({ msg: "code_ok", email: logger.email });
  });

exports.isValidCode = (model) =>
  AsyncHandler(async (req, res) => {
    const { code } = req.params;

    const isValidCode = await model.findOne({
      codeForgotPassword: code,
      $ne: null,
    });

    if (!isValidCode) {
      throw new Error("This Account dont exist !!!");
    }

    res.status(200).json({ userId: isValidCode._id, status: "ok" });
  });

exports.resetPasswordWithCode = (model) =>
  AsyncHandler(async (req, res) => {
    const { code } = req.body;
    const { email } = req.body;

    // const logger = await model.findOne({
    //   codeForgotPassword: code,
    //   $ne: null,
    //   email: email,
    // });
    // if (!logger) {
    //   throw new Error("This Account dont exist");
    // }

    const passwordHash = await bcrypt.hash(req.body.password, 12);

    const updatePass = await model.findOneAndUpdate(
      {
        codeForgotPassword: code,
        email: email,
      },
      {
        password: passwordHash,
        passwordActive: 1,
        codeForgotPassword: null,
      },
      {
        new: true,
      }
    );

    //send email password changed
    const subject = `Your Password has been changed - ${process.env.nameClub}`;
    const message = ` Hi Dear <b>${updatePass.first_name} ${updatePass.last_name}</b>
       <br>. Your AFN => ${updatePass.AFN}
       <br>
       Your birth Day => ${updatePass.birthDay}
       <br>
       <div style="background-color:grey;color:black;padding: 10px;text-align:left;font-weight:bold;font-size:18;">
       <p>malesuada scelerisque. amet ultricies amet Donec et tincidunt luctus.</p>
       <p> eu ut ultricies diam, tellus sapien auctor tortor bibendum et Suspendisse vel luctus.</p>
       <p> ut amet, amet, fermentum In at nisi ullamcorper eu.</p>
       <p>  Suspendisse sollicitudin sapien vel amet,</p>
       <p>    vitae vel consectetur Maecenas auctor ullamcorper ultricies tincidunt </p>
       <p>    ultricies massa tortor scelerisque.</p>
       <p> vel aliquet vestibulum ut fringilla. </p>
       <p> Maecenas a lacinia. amet Maecenas risus Suspendisse libero </p>
        </div>
       <br><br>
       date change passowrd is => ${updatePass.updatedAt}
       `;
    await sendMail({
      email: updatePass.email,
      subject: subject,
      message: message,
    });

    res.status(200).json({ msg: "Success Change password" });
  });

exports.activeEmail = (model) =>
  AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const logger = await model.findById(id);

    if (!logger) {
      throw new Error("This user dont exist !!!");
    }

    if (logger.emailActive === 1) {
      throw new Error("This email is already activated");
    }
    //659440
    const generatedPassword = Math.floor(100000 + Math.random() * 900000);

    //hashing Code random
    const passHashing = await bcrypt.hash(generatedPassword.toString(), 12);

    const activeEmail = await model.findByIdAndUpdate(id, {
      emailActive: 1,
      password: passHashing,
    });

    if (!activeEmail) {
      return new Error("Error Active Email, please try Again");
    }

    //send password random to email
    const subject = "Your email activated";
    const message = ` Hi Dear ${activeEmail.first_name} ${activeEmail.last_name}
       <br>. Your email is acivated
       <br>
       Your [password] =>  <b> ${generatedPassword} </b>
             <br>
       Pleasee login and change it.
       `;
    await sendMail({
      email: activeEmail.email,
      subject: subject,
      message: message,
    });

    res.status(201).json({
      message: "we Send new password to your emeil, please login and change it",
      password: generatedPassword,
    });
  });

exports.generateRandomAFN = (req, res, next) => {
  const random = randomize("A0", 10); //will generate a 10-character, uppercase alpha-numeric randomized string
  const AFN = `${random.slice(0, 3)}-${random.slice(3, 6)}-${random.slice(
    6,
    10
  )}`;

  req.body.AFN = AFN;

  next();
};

exports.deleteFromResultMatch = (model, info) =>
  AsyncHandler(async (req, res, next) => {
    const resultMatchID = req.params.resultID;
    const { deleteID } = req.params;
    // console.log("====> Data =====>", req.body);
    const result = await model
      .findOne({ _id: resultMatchID })
      .select(`${info}  -_id`);

    const AfterRemove = [];

    // eslint-disable-next-line no-unused-expressions
    result[info].forEach((goal) => {
      if (req.method === "DELETE") {
        if (goal._id != deleteID) {
          console.log("============> in DELETE ====>", goal._id);
          AfterRemove.push(goal);
        }
      }

      console.log(req.body);

      if (req.method == "PUT") {
        if (goal._id == deleteID) {
          // AfterRemove.push({
          //   goalPlayer: ObjectId.Types.ObjectId(req.body.goalPlayer),
          //   goalAssist: ObjectId.Types.ObjectId(req.body.goalAssist),
          //   goalTime: req.body.goalTime,
          //   _id: ObjectId.Types.ObjectId(deleteID),
          // });
          req.body._id = deleteID;
          AfterRemove.push(req.body);
        } else {
          AfterRemove.push(goal);
        }
      }

      console.log(
        "=>>>>>>>>>>>>>> fin",
        ObjectId.Types.ObjectId(req.body.goalPlayer)
      );

      // next();
    });

    console.log("=>>>>>>>>>>>>>> exist forEach", AfterRemove);

    const newResult = await model.findByIdAndUpdate(
      resultMatchID,
      { $set: { [info]: AfterRemove } },
      { new: true }
    );

    console.log("=>>>>>>>>>>>>>> after update data", info);

    if (!newResult) {
      throw new Error("Error to update");
    }

    res.status(200).json({ data: newResult });
  });
