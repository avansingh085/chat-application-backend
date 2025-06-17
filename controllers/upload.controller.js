const  uploadBufferToCloudinary =require("../services/upload.service.js");

module.exports=uploadImage = async (req, res) => {
  try {
   
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }
 
    const result = await uploadBufferToCloudinary(req.file.buffer);
    return res.status(200).json({ success: true, message: "Upload successful", url: result.secure_url });
  } catch (error) {
    console.error("Upload controller error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload file", error });
  }
};



