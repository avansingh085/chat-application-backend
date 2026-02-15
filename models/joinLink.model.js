const mongoose=require('mongoose');

const joinLinkSchema=new mongoose.Schema({
   conversationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

groupJoinId: {
  type: String,
  required: true,
  unique: true,
},

joinLinkExpiresAt: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), 
}

})

const joinLink=mongoose.model('joinLink',joinLinkSchema);

module.exports=joinLink;