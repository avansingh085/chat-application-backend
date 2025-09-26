const mongoose =require('mongoose');
const  {Schema}=require('mongoose');

const groupAutoDeleteSchema=new Schema({
    conversationId:{type:mongoose.Types.ObjectId,required:true,ref:'Conversation'},
    date:{type:Date,required:true},
    userId:{type:String,required:true}
})

const groupAutoDelete=new mongoose.model('groupAutoDelete',groupAutoDeleteSchema);
module.exports=groupAutoDelete;