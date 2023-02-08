const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
    },
    feedback: { type: String, enum: ["Request", "Feedback"] },
    message: { type: String, trim: true },
    active: { type: Boolean, default: true },

    adminComments: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const ContactForm = mongoose.model("ContactForm", contactFormSchema);

module.exports = ContactForm;
