const seasonModel = require("../Models/seasonModel");

const handleFacory = require("./handleFactory");

exports.createSeasonService = handleFacory.createNew(seasonModel);

exports.getAllSeasons = handleFacory.getAll(seasonModel);

exports.getSeasonByID = handleFacory.getOne(seasonModel);

exports.disactivateSeasonByID = handleFacory.disactiveOne(seasonModel);

exports.updateSeasonService = handleFacory.updateByID(seasonModel);
