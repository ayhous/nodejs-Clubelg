const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const matchModel = require("../Models/matchModel");
const handleFacory = require("./handleFactory");

const { uploadMultiImages } = require("../middleeware/uploadImageMiddleware");

const storage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(Error("This file is not image, please select image"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });

exports.uploadMultiImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 4,
  },
]);

exports.resizeMultiImageMiddleware = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
    try {
      await sharp(req.files.imageCover[0].buffer)
        .resize(1200, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 60 })
        .toFile(`uploads/matches/${imageName}`);
    } catch (err) {
      console.log("Error resize image ", err);
    }

    req.body.imageCover = `matches/${imageName}`;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (image) => {
        const imageName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.jpeg`;
        try {
          await sharp(image.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 60 })
            .toFile(`uploads/matches/${imageName}`);
        } catch (err) {
          console.log("Error resize image ", err);
        }

        req.body.images.push(`matches/${imageName}`);
      })
    );
  }

  next();
});

exports.addNIDToRequest = asyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;
  if (req.logger) req.body.personn = req.logger;

  next();
});

exports.createMatchService = handleFacory.createNew(matchModel, "matchs");

exports.deleteMatchService = handleFacory.disactiveOne(matchModel);

exports.getAllMatchService = handleFacory.getAll(matchModel);

exports.getMatchByIDService = handleFacory.getOne(matchModel);

exports.updateMatchByID = handleFacory.updateByID(matchModel);

exports.matchesByClubId = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  const matches = await matchModel
    .find({
      idClub: clubId,
      state: 1,
    })
    .sort({ createdAt: -1 });

  if (!matches) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ msg: "success", data: matches });
});

exports.matchesAddNotofication = asyncHandler(async (req, res, next) => {
  const { idMatch, typeAction, valueToggle, personn } = req.body;

  const query = {
    _id: idMatch,
    state: 1,
  };

  // Add an additional check if valueToggle is true
  if (valueToggle) {
    query[`notification.${typeAction}.idUser`] = { $ne: personn };
  }

  const updateOperation = valueToggle
    ? {
        $push: {
          [`notification.${typeAction}`]: {
            idUser: personn,
            dateCreated: new Date(),
          },
        },
      }
    : {
        // Remove notification if valueToggle is false
        $pull: {
          [`notification.${typeAction}`]: { idUser: personn },
        },
      };

  await matchModel.findOneAndUpdate(query, updateOperation, {
    new: true,
  });

  // if (!matches) {
  //   res.status(400).json("No available data");
  // }

  res.status(200).json({ msg: "success", data: valueToggle });
});

exports.matchesByCategoryId = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { stateMatch } = req.query;
  let { filter } = req.query;

  const query = {
    category: categoryId,
    state: 1,
  };

  if (stateMatch) {
    query.stateMatch = stateMatch;
  }

  if (filter) {
    filter = filter.replace(/,/g, " ");

    console.log("filtter ===> ", filter);
  }

  console.log("data ==> ", query);

  const matches = await matchModel
    .find(query)
    .sort({ matchTime: 1 })
    .select(filter);

  if (!matches) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ msg: "success", data: matches });
});

exports.startMatch = asyncHandler(async (req, res, next) => {
  const { idMatch, state } = req.body;

  console.log("data req.body", idMatch);

  let stateMatch;
  let description;

  switch (state) {
    case "startMatch":
      stateMatch = "live";
      description = "start Match";

      break;

    case "pauseMatch":
      stateMatch = "pause";
      description = "pause Match";

      break;

    case "endMatch":
      stateMatch = "ended";
      description = "end Match";

      break;

    default:
      stateMatch = "soon";
      description = "soon Match";
      break;
  }

  const matches = await matchModel
    .findOneAndUpdate(
      {
        _id: idMatch,
        state: 1,
      },
      {
        stateMatch: stateMatch,
        $push: {
          [`whoAdd`]: {
            personn: req.body.personn,
            dateCreated: new Date(),
            description: description,
          },
        },
      },
      {
        new: true,
      }
    )
    .sort({ createdAt: -1 });

  if (!matches) {
    res.status(400).json("No available data");
  }

  res.status(200).json({ msg: "success", data: matches });
});

// exports.uploadMatchImage = uploadSingleImage("image");
exports.uploadMatchImage = uploadMultiImages(
  "image",
  400,
  400,
  "image",
  "match",
  "webp",
  30,
  false
);
// exports.resizeMatchImage = resizeMultiImageMiddleware(
// 800, 600, "image", "match", "webp", 90, false;
// );

exports.uploadImageMatch = asyncHandler(async (req, res) => {
  const matche = await matchModel.findOneAndUpdate(
    {
      _id: req.body.idMatch,
      state: 1,
    },
    {
      $push: {
        images: {
          name: req.body.image[0],
          createdBy: req.body.personn,
          text: req.body.text,
          permissionView: req.body.permission,
        },
      },
    },
    {
      new: true,
    }
  );

  if (!matche) {
    res.status(400).json("Error add new image");
  }

  res.status(200).json({ msg: "success" });
});

exports.getAllMediasMatch = asyncHandler(async (req, res) => {
  console.log("match id ==>", req.params.id);

  const media = await matchModel
    .findById(req.params.id)
    .select("images -category -idClub -opponentID")
    .sort({ createdAt: -1 });

  if (!media) {
    res.status(400).json("Error get images");
  }

  res.status(200).json({ msg: "success", data: media });
});
