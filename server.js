require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js");
const sgMail = require("@sendgrid/mail");
const sendGrid = require("./routes/sendGrid.js");

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Import
// const usersController = require("./controllers/usersController.js");
const cablesController = require("./controllers/cablesController.js");
const contactFormController = require("./controllers/contactFormController.js");
const requestFormController = require("./controllers/requestFormController.js");

//MIDDLEWARE

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);
// app.use(express.static("../client/dist"))
app.use(morgan("dev"));
// app.use("/api/users", usersController);
app.use("/auth", authRoutes);
app.use("/api/cable", cablesController);
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(express.urlencoded({ extended: true }));
// app.use("/api/contact", sendGrid);
app.use("/api/contactform", contactFormController);
app.use("/api/requestform", requestFormController);

//MONGO
const mongoURI = process.env.SECRET_KEY;
const db = mongoose.connection;
mongoose.set("runValidators", true); // here is your global setting
mongoose.set("strictQuery", false);
mongoose.set("debug", true);
mongoose.connect(mongoURI);

// Connection Error/Success
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));

app.get("/api/", (req, res) => {
  res.json({ msg: "Hello World! It's the beginning of something exciting!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("..", "client", "dist", "index.html"));
});
//Listener
db.once("open", () => {
  console.log("connected to mongo", mongoURI);
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});
