const mongoose = require("mongoose");

const paracordColorSchema = new mongoose.Schema(
  {
    color: { type: String, required: true }, // trim, name of color/pattern
    description: { type: String }, //
    //learn to upload picture? && add URL
    //colorID: {type: Number, required: true}, //USE OBJECTID INSTEAD?

    //USE MONGOOSE ENUMS
  },
  { timestamps: true }
);

const Booking = mongoose.model("ParacordColor", paracordColorSchema);

module.exports = ParacordColor;
