const TrainingModel = require("../Models/TrainingModel");

const handleFacory = require("./handleFactory");

exports.createTrainingService = handleFacory.createNew(TrainingModel);

exports.getAllTrainings = handleFacory.getAll(TrainingModel);

exports.getTrainingByID = handleFacory.getOne(TrainingModel);

exports.disactivateTrainingByID = handleFacory.disactiveOne(TrainingModel);

exports.updateTrainingService = handleFacory.updateByID(TrainingModel);
