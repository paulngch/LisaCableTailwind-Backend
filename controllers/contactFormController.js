const express = require("express");
const router = express.Router();
require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const ContactForm = require("../models/contactForm");

//===============================
//Uploading (POST) contactForm to mongoDB
router.post("/", async (req, res) => {
  // console.log("req.body", req.body);
  const msg = req.body;
  try {
    //creating form from schema, sending to mongoDB
    const contactForm = await ContactForm.create(req.body);

    //SENDING TWILIO SMS
    client.messages
      .create({
        body: `CONTACTFORM: ${msg.name}, ${msg.email}, ${msg.feedback}, ${msg.message}`,
        from: `${process.env.TWILIO_FROM_NUMBER}`,
        to: `${process.env.TWILIO_MY_NUMBER}`,
      })
      .then((message) => console.log(message.sid));

    //SENDING TWILIO EMAIL
    const email = {
      to: [`${process.env.SENDGRID_EMAIL1}`, `${process.env.SENDGRID_EMAIL2}`], // recipient
      from: `${process.env.SENDGRID_EMAIL1}`, // verified sender
      subject: `SendGrid: CONTACT FORM from ${msg.name} , ${msg.email}`,
      text: `${msg.name} , ${msg.email} , ${msg.feedback} , ${msg.message}`,
      html: `Email: ${msg.email}
        Name: ${msg.name}
        Feedback Type: ${msg.feedback}
        Message: ${msg.message}`,
    };

    sgMail.sendMultiple(email).then(() => {
      console.log("Email sent");
    });

    res.status(201).json(contactForm);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Retrieving (GET) ALL contactForm from mongoDB
router.get("/", async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("RES", res);
  // return res.json(res)
  try {
    // creating form from schema, sending to mongoDB
    const contactList = await ContactForm.find().exec();
    res.status(201).json(contactList);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Retrieving (GET) SINGLEcontactForm from mongoDB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params["id"]);
    console.log(id);
    const fetchSingleForm = await ContactForm.findById(id);
    res.status(200).json(fetchSingleForm);
  } catch (error) {
    res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});
//===============================
//Updating (PUT) SINGLEcontactForm to mongoDB
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateSingleForm = await ContactForm.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateSingleForm);
  } catch (error) {
    return res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});

module.exports = router;
