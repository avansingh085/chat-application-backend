const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  userId: { type: String,unique:true, required: true },
  firstName:{type:String,default:''},
   lastName:{type:String,default:''},
   contactNumber:{type:String,default:''},
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  lastSeen: { type: Date, default: Date.now },
  status: { type: String, default: "Hey there! I'm using ChatsApp" },
  contacts: [{ type: String, ref: "User" }],
});
module.exports = mongoose.model("User", UserSchema);
