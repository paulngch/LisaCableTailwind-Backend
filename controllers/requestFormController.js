const express = require("express");
const router = express.Router();
require("dotenv").config();
const RequestForm = require("../models/requestForm");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//===============================
//Uploading (POST) requestForm to mongoDB
router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const data = req.body;
    //creating form from schema, sending to mongoDB
    const requestForm = await RequestForm.create(req.body);
    
    //SENDING TWILIO EMAIL
    const msg = {
      to: [`${process.env.SENDGRID_EMAIL1}`, `${process.env.SENDGRID_EMAIL2}`], // recipient
      from: `${process.env.SENDGRID_EMAIL1}`, // verified sender
      subject: `SendGrid: Cable Commission Request from ${data.name} , ${data.email}`,
      text: `${data.email} , ${data.contact} , ${data.country} , ${data.comments}`,
      html: `Email: ${data.email}
      Contact: ${data.contact}
      Name: ${data.name}
      Discord: ${data.discord}
      Country: ${data.country}
      HostUSB: ${data.hostUsb}
      DeviceUSB: ${data.deviceUsb}
      Comments: ${data.comments}`,
    };

    sgMail.sendMultiple(msg)
    // .then(() => {
    //   console.log("Email sent");
    // });

    //SENDING TWILIO SMS
    client.messages.create({
      body: `REQUESTFORM: ${data.email}, ${data.contact}, ${data.name}, ${data.discord}, ${data.comments}`,
      from: `${process.env.TWILIO_FROM_NUMBER}`,
      to: `${process.env.TWILIO_MY_NUMBER}`,
    })
    // .then((message) => console.log(message.sid));

    res.status(201).json(requestForm);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Retrieving (GET) ALL requestForm from mongoDB
router.get("/", async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("RES", res);
  // return res.json(res)
  try {
    // creating form from schema, sending to mongoDB
    const requestList = await RequestForm.find().exec();
    res.status(201).json(requestList);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Retrieving (GET) SINGLErequestForm from mongoDB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params["id"]);
    console.log(id);
    const fetchSingleForm = await RequestForm.findById(id);
    res.status(200).json(fetchSingleForm);
  } catch (error) {
    res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});

//===============================
//Updating (PUT) SINGLErequestForm to mongoDB
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateSingleForm = await RequestForm.findByIdAndUpdate(
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
