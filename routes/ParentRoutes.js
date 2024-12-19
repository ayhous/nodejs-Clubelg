const express = require("express");

const {
  createParentValidator,
  getParentByIDValidator,
  deleteParentByIDValidator,
  updateParentValidator,
} = require("../utils/validators/ParentValidator");

const {
  createParentService,
  getAllParents,
  getParentByID,
  disactivateParentByID,
  updateParentService,
  searchByPhoneOrMail
} = require("../services/parentService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(authService.protect, createParentValidator, createParentService)
  .get(getAllParents);

router
  .route("/search")
  .post(authService.protect,
        // createParentValidator, 
        searchByPhoneOrMail
      );

router
  .route("/:id")
  .get(getParentByIDValidator, getParentByID)
  .delete(deleteParentByIDValidator, disactivateParentByID)
  .put(updateParentValidator, updateParentService);

module.exports = router;
