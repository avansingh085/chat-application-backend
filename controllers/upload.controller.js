const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/aws-s3.config.js");

const BUCKET = "avan-chat-app-123";

module.exports = async function uploadImage(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const fileName = `${uuidv4()}-${req.file.originalname}`;

    const key = `uploads/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    const fileUrl = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      url: fileUrl,
    });

  } catch (error) {
    console.error("Upload controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};