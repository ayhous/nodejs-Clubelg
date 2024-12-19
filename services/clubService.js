/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved, node/no-missing-require, import/no-extraneous-dependencies

const bcrypt = require("bcryptjs");
const AsyncHanler = require("express-async-handler");
const mongoose = require("mongoose");
const clubModel = require("../Models/clubModel");
const personnelModel = require("../Models/personnelModel");

const { ObjectId } = mongoose.Types;

const {
  uploadMultiImages,
  resizeImageMiddleware,
} = require("../middleeware/uploadImageMiddleware");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/clubs");
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split("/")[1];
//     const imageName = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}.${extension}`;
//     cb(null, `${file.fieldname}-${imageName}`);
//   },
// });

// exports.uploadClubImage = uploadSingleImage("logo");
exports.uploadClubImage = uploadMultiImages(
  "image",
  800,
  600,
  "image",
  "logo",
  "webp",
  90,
  false
);

exports.resizeImage = resizeImageMiddleware(
  120,
  120,
  "logo",
  "clubs",
  "png",
  60
);

// exports.uploadClubImageCover = uploadSingleImage("imageCover");
exports.uploadClubImageCover = uploadMultiImages(
  "imageCover",
  800,
  600,
  "imageCover",
  "clubs",
  "webp",
  90,
  false
);

exports.resizeImageCover = resizeImageMiddleware(
  900,
  600,
  "imageCover",
  "clubs",
  "webp",
  80,
  false
);

exports.addNIDToRequest = AsyncHanler(async (req, res, next) => {
  // eslint-disable-next-line no-undef
  // const random = randomize("A0", 10); //will generate a 10-character, uppercase alpha-numeric randomized string
  // req.body.NID = `${random.slice(0, 3)}-${random.slice(3, 6)}-${random.slice(
  //   6,
  //   10
  // )}`;

  req.body.NID = req.NID;
  next();
});

exports.createClub = AsyncHanler(async (req, res) => {
  const data = req.body;
  // console.log(data);

  // Parse JSON strings back into objects if needed
  if (typeof data.country === "string") {
    data.country = JSON.parse(data.country);
  }
  if (typeof data.stateCountry === "string") {
    data.stateCountry = JSON.parse(data.stateCountry);
  }
  if (typeof data.city === "string") {
    data.city = JSON.parse(data.city);
  }

  console.log(JSON.stringify(data, null, 2));

  const createClub = await clubModel.create(data);

  if (!createClub) {
    return res.status(404).json({ error: "Error insert new Club" });
  }

  res.status(200).json({ data: createClub });
});

exports.findClub = AsyncHanler(async (req, res) => {
  const { nameClub } = req.params;

  const findClubs = await clubModel
    .find({
      name: { $regex: nameClub, $options: "i" },
      clubActive: 1,
      state: 1,
    })
    .select("name logo stars address country city");

  if (!findClubs) {
    return res.status(404).json({ error: "Error insert new Club" });
  }

  res.status(200).json({ data: findClubs });
});

exports.getAllClubs = AsyncHanler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;

  const clubs = await clubModel.find({}).limit(limit).skip(skip);

  if (!clubs) {
    return res.status(404).json({ msg: "Error Get All clubs" });
  }

  res.status(200).json({ data: clubs });
});

exports.getAllClubsNearby = AsyncHanler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const clubs = await clubModel
    .find({})
    .limit(limit)
    .skip(skip)
    .select("logo name followers");

  if (!clubs) {
    return res.status(404).json({ msg: "Error Get All clubs" });
  }

  res.status(200).json({ data: clubs });
});

exports.getAllClubsByNID = AsyncHanler(async (req, res) => {
  const clubs = await clubModel
    .find({
      NID: req.body.NID,
      clubActive: 1,
      state: 1,
    })
    .select("_id name logo");

  if (!clubs) {
    return res.status(404).json({ msg: "Error Get All clubs" });
  }

  res.status(200).json({ data: clubs });
});

exports.getClubByID = AsyncHanler(async (req, res) => {
  const { id } = req.params;

  const club = await clubModel.findById(id);

  if (!club) {
    return res.status(404).json({ msg: "Error Get club" });
  }

  res.status(200).json({ data: club });
});

exports.addImageCover = AsyncHanler(async (req, res) => {
  const { _id, imageCover } = req.body;
  console.log("image body ==>", imageCover[0]);
  console.log("image _id ==>", _id);
  console.log("image req.body.NID ==>", req.body.NID);
  const club = await clubModel
    .findOneAndUpdate(
      {
        _id: _id,
        NID: req.body.NID,
      },
      { imageCover: imageCover[0] },
      {
        new: false,
      }
    )
    .select("imageCover");

  // const regex = new RegExp(
  //   `^${process.env.BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  // );
  // const pathOldImageCover = club.imageCover.toString().replace(regex, "");

  await clubModel
    .findOneAndUpdate(
      {
        _id: _id,
        NID: req.body.NID,
        "AllImagesCover.imageCover": { $ne: club.imageCover },
      },
      { $addToSet: { AllImagesCover: { imageCover: club.imageCover } } },
      {
        new: true,
      }
    )
    .select("imageCover");

  if (!club) {
    return res.status(404).json({ msg: "Error update this Image Cover club" });
  }

  res.status(200).json({ data: "Success update Image Cover" });
});

exports.updateImageCover = AsyncHanler(async (req, res) => {
  const { body } = req;

  const regex = new RegExp(
    `^${process.env.BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  const pathImageCover = body.imageCover.toString().replace(regex, "");

  const regexOld = new RegExp(
    `^${process.env.BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  const pathImageCoverOld = body.oldImageCover.toString().replace(regexOld, "");

  const club = await clubModel
    .findOneAndUpdate(
      {
        _id: body._id,
        NID: body.NID,
      },
      {
        imageCover: pathImageCover,
      },

      {
        new: true,
      }
    )
    .select("imageCover -_id");

  await clubModel
    .findOneAndUpdate(
      {
        _id: body._id,
        NID: body.NID,
        "AllImagesCover.imageCover": { $ne: pathImageCoverOld },
      },
      { $addToSet: { AllImagesCover: { imageCover: pathImageCoverOld } } },
      {
        new: false,
      }
    )
    .select("imageCover");

  if (!club) {
    return res.status(404).json({ msg: "Error update image Cover this club" });
  }

  res.status(200).json({ message: "Success Update image cover", data: club });
});

exports.updateClub = AsyncHanler(async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const club = await clubModel.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });

  if (!club) {
    return res.status(404).json({ msg: "Error update this club" });
  }

  res.status(200).json({ data: club });
});

exports.removeImageCoverById = AsyncHanler(async (req, res) => {
  console.log(ObjectId(req.body.idImageCover));

  const club = await clubModel.findOneAndUpdate(
    { _id: req.body._id, NID: req.body.NID },
    {
      $pull: {
        AllImagesCover: {
          _id: req.body.idImageCover,
        },
      },
    },
    { new: true }
  );

  if (!club) {
    return res.status(404).json({ msg: "Error Remove image Cover" });
  }

  res.status(200).json({ data: "okk" });
});

exports.disactivateClubByID = AsyncHanler(async (req, res) => {
  const { id } = req.params;

  const club = await clubModel.findByIdAndUpdate(
    { _id: id },
    { state: 0 },
    { new: true }
  );

  if (!club) {
    return res.status(404).json({ msg: "Error Disactivate this Club" });
  }

  res.status(200).json({ data: club });
});

//active club by email
exports.activeClubByEmail = AsyncHanler(async (req, res) => {
  const { id } = req.params;

  const ifNotActive = await clubModel.findById(id);

  if (!ifNotActive) {
    throw new Error("Error , not found info");
  }

  if (ifNotActive.clubActive === 1) {
    throw new Error("Error , This Account i already acivated");
  }

  res.status(200).send("please complete admin club information");
});

exports.createAdminClub = AsyncHanler(async (req, res) => {
  const { id } = req.params;

  // console.log(req.body);

  const club = await clubModel.findById(id);

  if (!club) {
    throw new Error("Error , not found info");
  }

  if (club.clubActive === 1) {
    throw new Error("Erdror , This Account is already acivated");
  }
  const passowrd = req.body.password;
  req.body.email = club.email;
  req.body.NID = club.NID;
  req.body.emailActive = 1;
  req.body.passwordActive = 1;
  req.body.rules = "admin";

  req.body.password = await bcrypt.hash(passowrd.toString(), 12);

  const createPersonn = await personnelModel.create(req.body);

  if (!createPersonn) {
    throw new Error("Error ,Not  Create info admin Club");
  }

  await clubModel.findByIdAndUpdate(id, { clubActive: 1 });

  res.status(200).json({ data: createPersonn });
});
