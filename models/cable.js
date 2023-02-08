const mongoose = require("mongoose");

const cableSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true }, // trim,
    image: { type: String, required: true },
    colorTheme: { type: String, trim: true }, //trim (e.g. White-Brown)
    cablePattern: { type: String, trim: true }, // TAG for SEARCH FUNCTION, (from from dropdown, Braid / Straight)
    cableType: { type: String, trim: true }, // TAG for SEARCH FUNCTION, (from from dropdown, TRRS / USB)
    connectorHostType: { type: String, trim: true }, // TAG for SEARCH FUNCTION, (e.g. from FEMO/GX, or NIL)
    connectorDeviceType: { type: String, trim: true }, // TAG for SEARCH FUNCTION, (e.g. from FEMO/GX, or NIL)
  },
  { timestamps: true }
);

const Cable = mongoose.model("Cable", cableSchema);

module.exports = Cable;
