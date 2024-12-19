const mongoose = require("mongoose");

const parentModel = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "This Field first name is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    last_name: {
      type: String,
      required: [true, "This Field last name is required"],
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      maxLength: [20, "Must be less then 20 Characters"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "This Field email is required"],
    },
    phone: {
      type: String,
      required: [true, "This Field phone is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      minLength: [3, "Must be gretter then 3 Characters"],
      required: [true, "This Field address is required"],
    },
    idClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    state: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parents", parentModel);
