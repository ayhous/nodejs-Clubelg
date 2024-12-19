const AsyncHandler = require("express-async-handler");
const randomize = require("randomatic");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
// eslint-disable-next-line no-undef
const { ObjectId } = mongoose.Types;
const personne = require("../Models/personnelModel");
const sendMail = require("../utils/sendEmail");

const { generatePasswordRandom } = require("../utils/verificationCode");

const { generateVerificationCode } = require("../utils/verificationCode");

const generateToken = require("../utils/jwt");

const {
  uploadMultiImages,
  resizeImageMiddleware,
} = require("../middleeware/uploadImageMiddleware");

// exports.uploadSingleImage = uploadSingleImage("image");
// exports.uploadSingleImage = uploadSingleImageDisk("image", "personn", 'webp');
exports.uploadSingleImage = uploadMultiImages(
  "image",
  250,
  250,
  "image",
  "personn",
  "webp",
  30,
  false
);

// exports.resizeImage = resizeImageMiddleware(
//   140,
//   140,
//   "image",
//   "personn",
//   "webp",
//   65,
//   false
// );

const handleFacory = require("./handleFactory");
const personnelModel = require("../Models/personnelModel");

exports.CreateNIDToRequest = AsyncHandler(async (req, res, next) => {
  const random = randomize("A0", 10);
  req.body.NID = `${random.slice(0, 3)}-${random.slice(3, 6)}-${random.slice(
    6,
    10
  )}`;
  next();
});

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;
  console.log("NID ==================>", req.NID);
  next();
});

exports.createAdminClub = AsyncHandler(async (req, res) => {
  const code = generateVerificationCode();

  console.log(req.body);

  if (typeof req.body.country === "string") {
    req.body.country = JSON.parse(req.body.country);
  }
  if (typeof req.body.stateCountry === "string") {
    req.body.stateCountry = JSON.parse(req.body.stateCountry);
  }
  if (typeof req.body.city === "string") {
    req.body.city = JSON.parse(req.body.city);
  }

  const MAX_TIME_EXPIRE = Date.now() + 3 * 60 * 1000;

  const passwordHash = await bcrypt.hash(req.body.password.toString(), 12);

  const createNeAdminClub = await personne.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    NID: req.body.NID,
    AFN: req.body.AFN,
    email: req.body.email,
    password: passwordHash,
    phone: req.body.phone,

    country: req.body.country,
    stateCountry: req.body.stateCountry,
    city: req.body.city,
    // rules: rules,
    verification_email: code,
    timeExpireValidEmail: MAX_TIME_EXPIRE,
  });

  if (!createNeAdminClub) {
    res.status(400).json("Error create new personn");
  }

  const token = generateToken(createNeAdminClub, "Personne");

  //send email to active
  // const subject = `Welcom to ${process.env.nameClub}`;
  // const message = ` Hi Dear ${createNeAdminClub.first_name} ${createNeAdminClub.last_name}
  //      <br>
  //      <br>
  //      please active your Email : <b> ${code} </b>
  //      `;
  // await sendMail({
  //   email: req.body.email,
  //   subject: subject,
  //   message: message,
  // });

  res.status(200).json({
    message: "please active you email",
    token: token,
    timeExpire: MAX_TIME_EXPIRE,
  });
});

exports.resendCodeOTP = AsyncHandler(async (req, res) => {
  const code = generateVerificationCode();

  const MAX_TIME_EXPIRE = Date.now() + 3 * 60 * 1000;

  const emailActive = await personne.findOneAndUpdate(
    {
      _id: req.logger,
    },
    {
      verification_email: code,
      timeExpireValidEmail: MAX_TIME_EXPIRE,
    },
    {
      new: true,
    }
  );

  //send email to active
  const subject = `Welcom to ${process.env.nameClub}`;
  const message = ` Hi Dear ${emailActive.first_name} ${emailActive.last_name}
       <br>
       <br>
       please active your Email : <b> ${code} </b>
       `;
  await sendMail({
    email: emailActive.email,
    subject: subject,
    message: message,
  });

  res
    .status(200)
    .json({ message: "please active you email", timeExpire: MAX_TIME_EXPIRE });
});

exports.verfiyCodeOTP = AsyncHandler(async (req, res) => {
  try {
    const emailActive = await personne.findOneAndUpdate(
      {
        _id: req.logger,
        verification_email: req.body.code,
        timeExpireValidEmail: { $gt: Date.now() },
      },
      {
        emailActive: true,
        verification_email: null,
      },
      {
        new: true,
      }
    );

    if (!emailActive)
      res.status(500).json({
        message: "Error to active Code OTP.please write correct code",
      });

    res
      .status(200)
      .json({ message: "Success Verifiy code, please try to login " });
  } catch (e) {
    // res.status(500).json({ message: "Error to active Code OTP" });
  }
});

exports.createPersonn = AsyncHandler(async (req, res) => {
  console.log("====> req.body ===> ", req.body);
  try {
    let { rules } = req.body;

    const { idClub } = req.body;

    // Parse JSON strings back into objects if needed
    if (typeof req.body.country === "string") {
      req.body.country = JSON.parse(req.body.country);
    }
    if (typeof req.body.stateCountry === "string") {
      req.body.stateCountry = JSON.parse(req.body.stateCountry);
    }
    if (typeof req.body.city === "string") {
      req.body.city = JSON.parse(req.body.city);
    }

    const passwordRadom = generatePasswordRandom(8);

    const passwordHash = await bcrypt.hash(passwordRadom.toString(), 12);

    //  const rules =  data.filter((id) => ObjectId(id));
    console.log("====> rules ===> ", rules);
    console.log("====> image ===> ", req.body.image);
    console.log("====> image ===> ", req.body.image);

    if (rules !== undefined) {
      rules = rules.split(",");
    }

    const idClubObj = ObjectId(idClub);

    const createNew = await personne.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      NID: req.body.NID,
      AFN: req.body.AFN,
      image: req.body.image,
      idClub: idClubObj,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      birthDay: req.body.birthDay,
      // rules: rules.map(rule => mongoose.Types.ObjectId(rule)),
      rules: rules,
      changePass_after_created: false,
      password: passwordHash,
      country: req.body.country,
      stateCountry: req.body.stateCountry,
      city: req.body.city,
    });

    if (!createNew) {
      res.status(400).json("Error create new personn enter try");
    }

    //send email to active
    const subject = ` ${process.env.nameClub}`;
    const message = ` Hi Dear ${createNew.first_name} ${createNew.last_name}
       <br>. Welcome to Club ${process.env.nameClub}
       <br>
       Your password  => <b> ${passwordRadom} </b>
       <br>
       <p  style="color: red;" >please after login , You have to change your password</p>
       `;

    try {
      await sendMail(
        {
          email: createNew.email,
          subject: subject,
          message: message,
        },

        res
          .status(200)
          .json({ message: "please active your email", data: createNew })
      );

      //  res.status(200).json({ message: "please active your email", data: createNew });
    } catch (e) {
      res.status(400).json("Error create new personn, Probleme send email");
    }
  } catch (e) {
    res.status(400).json({ messaqge: "Error create new personn ", errror: e });
    console.log("Error ===>", e);
  }
});

//378857
exports.activeEmail = handleFacory.activeEmail(personne);

exports.login = handleFacory.login(personne, "Personne");

//change passowrd => is login
exports.changePasswordService = handleFacory.changePassowrd(personne);

exports.forgotPasswordService = handleFacory.forgotPassword(personne);

exports.verifyCodeResetPass = handleFacory.verifyCodeResetPass(personne);

exports.isValidCodeForgotPass = handleFacory.isValidCode(personne);

//here after logger click link in email, and initialize new password
exports.resetPasswordWithCode = handleFacory.resetPasswordWithCode(personne);

exports.changePasswordNewPerson = async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 12);

  const updatePass = await personnelModel.findByIdAndUpdate(
    {
      _id: req.logger,
    },
    {
      password: passwordHash,
      changePass_after_created: true,
    },
    {
      new: true,
    }
  );

  const token = generateToken(
    updatePass,
    "Personne",
    updatePass.changePass_after_created
  );

  //send email password changed
  const subject = `Your Password has been changed - ${process.env.nameClub}`;
  const message = ` Hi Dear <b>${updatePass.first_name} ${updatePass.last_name}</b>
        </div>
        Your password changed 
       <br><br>
       date change passowrd is : <b> ${updatePass.updatedAt} </b>
       `;
  try {
    await sendMail(
      {
        email: updatePass.email,
        subject: subject,
        message: message,
      },

      res.status(200).json({ message: "Success Change password", token })
    );

    //  res.status(200).json({ message: "please active your email", data: createNew });
  } catch (e) {
    // res.status(400).json("Error create new personn, Probleme send email");
  }
};

exports.deletePersonn = handleFacory.disactiveOne(personne);

// exports.getAllPersonn = handleFacory.getAll(personne);

exports.getAllPersonn = AsyncHandler(async (req, res) => {
  const { idClub } = req.params;

  const data = { NID: req.NID, idClub: idClub };

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  const personns = await personne
    .find(data)
    .limit(limit)
    .skip(skip)
    .select(
      "_id AFN email image createdAt updatedAt address birthDay first_name last_name phone rules gender idClub"
    );

  if (!personns) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ results: personns.length, data: personns });
});

exports.updateImageProfile = AsyncHandler(async (req, res) => {
  // if(!req.file.image) res.status(400).json("Error update image profile");

  const personn = await personne.findOneAndUpdate(
    {
      _id: req.logger,
      NID: req.NID,
    },
    {
      image: req.body.image[0],
    },
    { new: true }
  );
  if (!personn) {
    res.status(400).json("Error update image profile");
  }

  console.log("data person update image", personn);

  const token = generateToken(personn, "personn");

  res.status(200).json({ token: token });
});

exports.getPersonnByID = handleFacory.getOne(personne);

exports.updatePersonnByID = AsyncHandler(async (req, res) => {
  const id = req.logger;
  let { body } = req;

  if (req.rules.includes("user") || !req.rules.includes("admin")) {
    body = {
      image: req.body.image,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
    };
  }
  const data = await personne.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });

  if (!data) {
    res.status(400).json("No available data");
  }

  // const subject = "Your email is changed";
  // const message = ` Hi Dear ${data.first_name} ${data.last_name}
  //      <br>. Yuor AFN => ${data.AFN}
  //      <br>
  //      YuorAFN => ${data.birthDay}
  //      `;
  // await sendMail({
  //   email: "ayouzi86@gmail.com",
  //   subject: subject,
  //   message: message,
  // });
  res.status(200).json({ data: data });
});

exports.updatePersonnByAdmin = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  if (req.body.rules) {
    const rules = ["user"];
    const rulesRec = req.body.rules;
    const rulesRecSplite = rulesRec.split(",");

    rulesRecSplite.forEach((obj) => {
      rules.push(obj);
    });

    req.body.rules = rules;
  }

  const personn = await personne.findOne({ _id: id, NID: body.NID });

  if (!personn) {
    res.status(400).json("Error: this peronn not exist");
  }

  const data = await personne.findByIdAndUpdate(
    { _id: id },
    {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      gender: body.gender,
      rules: req.body.rules,
      birthDay: body.birthDay,
      state: body.state,
    },
    {
      new: true,
    }
  );

  if (!data) {
    res.status(400).json("No available data");
  }

  const subject = "Your information changed";
  const message = ` Hi Dear <b>${data.first_name} ${data.last_name} </b>
       <br><br><br>. <p style="background-color:yellow;"> Your information changed by adminstrator </p>
       <br><br><br>
       date changed  : <p style="background-color:black;color:white"> ${data.updatedAt} </p>
       `;
  await sendMail({
    email: "ayouzi86@gmail.com",
    subject: subject,
    message: message,
  });
  res.status(200).json({ data: data });
});
