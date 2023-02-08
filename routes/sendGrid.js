const path = require("path");
require("dotenv").config(); 
const sgMail = require("@sendgrid/mail");
const express = require("express");
const app = express();
const router = express.Router()

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// app.route("/").get(function (req, res) {
//   res.sendFile(path.join(__dirname, "/form.html"));
// });
// const msg2 = {
//     to: `process.env.SENDGRID_EMAIL1`, // recipient
//     from: `process.env.SENDGRID_EMAIL1`, //verified sender
//     subject: 'Sending Batch 2',
//     text: 'Sending another batch. This is 2',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   }

  //   const msg = {
  //     to: `process.env.SENDGRID_API_KEY`, // recipient
  //     from: "process.env.SENDGRID_API_KEY", //verified sender
  //     subject: req.body.subject,
  //     text: `Message from ${req.body.email}:\n${req.body.message}`,
  //   };

// app.post("/", (req, res) => {
//   console.log(req);
//   try {
//     sgMail.send(msg2);
//     res.status(201).json({msg:"Message Successfully Sent!"});
//   } catch (error) {
//     res.send("Message Could not be Sent");
//   }
// });

// const msg = {
//     to: `hsudaizi@gmail.com`, // Change to your recipient
//     from: `${process.env.SENDGRID_EMAIL2}`, // Change to your verified sender
//     subject: 'Sending batch 3',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   }
  
//   sgMail
//     .send(msg)
//     .then((response) => {
//         console.log("email sent")
//       console.log(response[0].statusCode)
//       console.log(response[0].headers)
//     })
//     .catch((error) => {
//       console.error(error)
//     })





module.exports = router;