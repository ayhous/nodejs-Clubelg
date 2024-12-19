const AsyncHandler = require("express-async-handler");
const ObjectId = require("mongoose");
const storeCategoryModel = require("../Models/storeCategoryModel");

exports.addNIDToRequest = AsyncHandler(async (req, res, next) => {
  if (req.NID) req.body.NID = req.NID;

  next();
});

exports.createStoreCategoryService = AsyncHandler(async (req, res) => {
  console.log("data store Sended ===>", req.body);
  let productCategory = null;

  const findCategoryifExist = await storeCategoryModel.findOne({
    NID: req.NID,
    idClub: ObjectId.Types.ObjectId(req.body.idClub),
  });

  if (findCategoryifExist) {
    productCategory = await storeCategoryModel.findOneAndUpdate(
      {
        NID: req.NID,
        idClub: ObjectId.Types.ObjectId(req.body.idClub),
      },
      {
        $push: {
          listCategories: {
            createdBy: ObjectId.Types.ObjectId(req.logger),
            name: req.body.name,
            dateCreated: Date.now(),
          },
        },
      },
      { new: true }
    );
  } else {
    productCategory = await storeCategoryModel.create({
      NID: req.NID,
      idClub: ObjectId.Types.ObjectId(req.body.idClub),

      listCategories: {
        createdBy: ObjectId.Types.ObjectId(req.logger),
        name: req.body.name,
        dateCreated: Date.now(),
      },
    });
  }

  if (!productCategory) {
    res.status(400).json("Error create new category");
  }

  res.status(200).json({ data: productCategory });
});

exports.getAllCategories = AsyncHandler(async (req, res) => {
  try {
    const idClub = ObjectId.Types.ObjectId(req.params.idClub);
    console.log("idClub product ======>", idClub);
    const listCategories = await storeCategoryModel.findOne({
      idClub: idClub,
      state: true,
    });

    if (!listCategories) {
      res.status(400).json("No available products");
    }
    res.status(200).json({ data: listCategories });
  } catch (e) {
    res.status(400).json("Error to get  products ");
  }
});
