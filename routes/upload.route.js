const  express=require("express");
const   uploadImage  =require("../controllers/upload.controller.js");
const  upload  =require("../middlewares/multer.middleware.js");

const router = express.Router();
const checkToken=require('../middlewares/verifyToken.js');
router.use(checkToken);

router.post("/file",upload.single('file'), uploadImage); // field name: file

module.exports= router;
