const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const multer = require("multer");
const crypto = require("crypto");
const Cable = require("../models/cable");

const checkAuth = require("../middleware/checkAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

//==========
//Declaring variables to be mapped after exporting
let cableUrlArray = [];
let cableDescArray = [];
let cableIdArray = [];
let cableListObject = [{}];

//===============================
//GET request for ALL* images in the album
router.get("/", async (req, res) => {
  try {
    cableUrlArray = [];
    cableDescArray = [];
    cableIdArray = [];
    cableListObject = [];
    const cables = await Cable.find().exec();
    for (let cable of cables) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: cable.image,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      cable.imageUrl = url;
      cableUrlArray.push(cable.imageUrl);
      cableDescArray.push(cable.description);
      cableIdArray.push(cable._id);
    }

    //==================
    //Combining both arrays to give single array with key:value pair
    for (let i = 0; i < cableDescArray.length; i++) {
      cableListObject.push({
        desc: cableDescArray[i],
        url: cableUrlArray[i],
        id: cableIdArray[i],
      });
    }

    res.status(201).send(cableListObject);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//GET request for SINGLE* image in the album
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleCable = await Cable.findById(id);
    const getObjectParams = {
      Bucket: bucketName,
      Key: singleCable.image,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    singleCable.imageUrl = url;
    console.log("SINGLECABLE%^#$", singleCable);
    console.log(singleCable.imageUrl);
    if (!singleCable) {
      return res.status(400).json({
        data: "",
        error: "No Cable Found",
      });
    }
    res.status(200).json({
      data: singleCable,
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});

//===============================
//Uploading (POST) image to S3 & sending to mongo
router.post("/", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  try {
    req.file.buffer;
    const imageName = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    //creating cable from schema, sending to mongoDB
    const cable = await Cable.create({
      description: req.body.description,
      image: imageName,
    });
    res.status(201).json(cable);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//===============================
//Deleting uploaded image from S3 & removing from mongo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleCable = await Cable.findById(id);
    const getObjectParams = {
      Bucket: bucketName,
      Key: singleCable.image,
    };
    const command = new DeleteObjectCommand(getObjectParams);
    await s3.send(command);
    await Cable.findByIdAndRemove(id);
    if (!singleCable) {
      return res.status(400).json({
        data: "",
        error: "No Cable Found",
      });
    }
    res.status(200).json({
      msg: `cable ${id} successfully deleted`,
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});

//===============================
//Editing uploaded image's description & sending to mongoDB
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCable = await Cable.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send(updatedCable);
  } catch (error) {
    return res.status(400).json({
      data: "",
      error: error.message,
    });
  }
});

module.exports = router;
