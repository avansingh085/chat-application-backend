const User = require('../models/user.model.js');

const groupAutoDelete = require('../models/groupAutoDelete.model');

class GroupAutoDeleteController {
    async create(req, res) {
        try {
            const { id } = req.user;
            const { conversationId, date } = req.body;

            if (!conversationId || !date) {
                return res.status(400).json({ success: false, message: "Invalid input. Please enter valid input" });
            }

            const user = await User.findById(id);

            if (!user) {
                return res.status(403).json({ success: false, message: "Invalid user id" });
            }

            const newGroupAutoDelete = await groupAutoDelete.create({
                conversationId,
                date,
                userId: id
            });

            return res.status(201).json({ success: true, data: newGroupAutoDelete });

        } catch (err) {
            return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
        }
    }

    async update(req, res) {
        try {
           
            const { id } = req.params;
            console.log(id,"LLLL")
            const { conversationId, date } = req.body;

            const updatedDoc = await groupAutoDelete.findByIdAndUpdate(
                id,
                { conversationId, date },
                { new: true, upsert: false }  // new:true returns updated doc
            );
            console.log(updatedDoc)
            if (!updatedDoc) {
                return res.status(404).json({ success: false, message: "Record not found" });
            }

            return res.status(200).json({ success: true, data: updatedDoc });

        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
        }
    }

    async getGroupAutoDeleteByConversationIdAndUserId(req, res) {
        try {
            console.log("LLLLLLL")
            const { conversationId } = req.params;
            const { id } = req.user;
           console.log(conversationId,id)
            const groupAD = await groupAutoDelete.findOne({}).lean();
          console.log(await groupAutoDelete.findOne())
            if (!groupAD) {
                return res.status(404).json({ success: false, message: "group auto delete not found" });
            }
            return res.status(200).json(groupAD);
        } catch (err) {
            return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
        }
    }


}

module.exports = new GroupAutoDeleteController();
