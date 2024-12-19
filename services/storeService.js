const AsyncHandler = require("express-async-handler");
const ObjectId = require("mongoose");
const { uploadMultiImages } = require("../middleeware/uploadImageMiddleware");
const storeModel = require("../Models/storeModel");

exports.uploadproductImages = uploadMultiImages(
  "images",
  1000,
  600,
  "images",
  "store",
  "webp",
  70
);

exports.uploadproductImageSlider = uploadMultiImages(
  "imageSlider",
  1000,
  600,
  "imageSlider",
  "store",
  "webp",
  70
);

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;

  next();
});

exports.createProductService = AsyncHandler(async (req, res) => {
  console.log("data store Sended ===>", req.body);
  // console.log("data req.logger ===>", req.logger);
  // console.log("data req.body.photos[0] ===>", req.body.photos[0]);

  const colorsString = req.body.colors;
  const sizeString = req.body.size;
  const product = await storeModel.create({
    createdBy: ObjectId.Types.ObjectId(req.logger),
    NID: req.NID,
    idClub: ObjectId.Types.ObjectId(req.body.idClub),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    specification: req.body.specification,
    pinToSlider: req.body.pinToSlider,
    price: {
      basic: req.body.price_basic,
      currency: req.body.currency,
    },
    // category: ObjectId.Types.ObjectId(req.body.category),
    quantity: req.body.quantity,
    options: {
      colors: colorsString.split(","),
      size: sizeString.split(","),
      images: req.body.images,
    },

    imageShowFirst: req.body.images[0],
  });

  if (!product) {
    res.status(400).json("Error create new Product");
  }

  res.status(200).json({ data: product });
});

exports.getAllProductsClub = AsyncHandler(async (req, res) => {
  try {
    const idClub = ObjectId.Types.ObjectId(req.params.id);
    console.log("idClub product", idClub);
    const products = await storeModel
      .find({
        idClub: idClub,
        state: true,
      })
      .select("category imageShowFirst title price whoFavorite")
      .sort({ createdAt: -1 });

    if (!products) {
      res.status(400).json("No available products");
    }
    res.status(200).json({ data: products });
  } catch (e) {
    res.status(400).json("Error to get  products ");
  }
});

exports.getproductsByIdCategory = AsyncHandler(async (req, res) => {
  try {
    const idClub = ObjectId.Types.ObjectId(req.params.id);
    const idCategory = ObjectId.Types.ObjectId(req.params.idCategory);
    console.log("idClub product", idClub);
    const products = await storeModel
      .find({
        idClub: idClub,
        category: idCategory,
        state: true,
      })
      .select("category imageShowFirst title price whoFavorite")
      .sort({ createdAt: -1 });

    if (!products) {
      res.status(400).json("No available products");
    }
    res.status(200).json({ data: products });
  } catch (e) {
    res.status(400).json("Error to get  products ");
  }
});

exports.getProductsInSlider = AsyncHandler(async (req, res) => {
  try {
    const idClub = ObjectId.Types.ObjectId(req.params.id);
    console.log("idClub product", idClub);
    const products = await storeModel
      .find({
        idClub: idClub,
        state: true,
        pinToSlider: true,
      })
      .select("category imageShowFirst title price")
      .sort({ createdAt: -1 })
      .limit(5);

    if (!products) {
      res.status(400).json("No available products");
    }
    res.status(200).json({ data: products });
  } catch (e) {
    res.status(400).json("Error to get  products ");
  }
});

exports.getProductByID = AsyncHandler(async (req, res) => {
  try {
    const idproduct = ObjectId.Types.ObjectId(req.params.id);
    console.log("idClub product", idproduct);
    const product = await storeModel
      .findOne({
        _id: idproduct,
        state: true,
      })
      .select("-createdBy ");

    if (!product) {
      res.status(400).json("No available products");
    }
    res.status(200).json({ data: product });
  } catch (e) {
    res.status(400).json("Error to get  products ");
  }
});

//////////// Add - remove Like Post//////////////////////
exports.addProductToFavoriteService = AsyncHandler(async (req, res) => {
  const favorite = await storeModel
    .findByIdAndUpdate(
      {
        _id: req.params.id,
        "whoFavorite.user": { $ne: req.logger },
      },
      {
        $push: {
          whoFavorite: {
            typeLogger: req.typeLogger,
            user: req.logger,
          },
        },
        $inc: {
          favorite: 1, // Increment the `favorite` field by 1
        },
      },
      {
        new: true,
      }
    )
    .select("whoFavorite favorite");

  if (!favorite) {
    res.status(400).json("Error create new post");
  }

  res.status(200).json({ data: favorite });
});

exports.removeProductFromFavoriteService = AsyncHandler(async (req, res) => {
  const favorite = await storeModel
    .findOneAndUpdate(
      {
        _id: req.params.id,
        whoFavorite: {
          $elemMatch: {
            user: req.logger,
          },
        },
      },
      {
        $pull: {
          whoFavorite: { user: req.logger },
        },
      },
      {
        new: true,
      }
    )
    .select("whoFavorite");

  if (!favorite) {
    res.status(400).json("Error remove favorite product");
  }

  res.status(200).json({ data: favorite });
});
