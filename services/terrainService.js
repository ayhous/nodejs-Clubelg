const terrainModel = require("../Models/terrainModel");

const handleFacory = require("./handleFactory");

exports.createTerrainService = handleFacory.createNew(terrainModel);

exports.getAllTerrains = handleFacory.getAll(terrainModel);

exports.getTerrainByID = handleFacory.getOne(terrainModel);

exports.disactivateTerrainByID = handleFacory.disactiveOne(terrainModel);

exports.updateTerrainService = handleFacory.updateByID(terrainModel);
