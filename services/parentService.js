const AsyncHanler = require("express-async-handler");
const parentModel = require("../Models/parentModel");
const handleFacory = require("./handleFactory");

exports.createParentService = handleFacory.createNew(parentModel);

exports.getAllParents = handleFacory.getAll(parentModel);

exports.getParentByID = handleFacory.getOne(parentModel);

exports.disactivateParentByID = AsyncHanler(async (req, res) => {
  const { id } = req.params;
  const Parent = await parentModel.findByIdAndUpdate(
    { _id: id },
    { state: 0 },
    { new: true }
  );

  if (!Parent) {
    res.status(400).json("No available Parent");
  }

  res.status(200).json({ data: Parent });
});

exports.searchByPhoneOrMail = AsyncHanler(async (req, res) => {
  
  const Parent = await parentModel.findOne({

    $or : [
      {email : req.body.searchParent},
      {phone : req.body.searchParent},
    ]
    
  });

  if (!Parent) {
    res.status(400).json("No available Parent");
  }

  res.status(200).json({ data: Parent });
});

exports.updateParentService = handleFacory.updateByID(parentModel);
