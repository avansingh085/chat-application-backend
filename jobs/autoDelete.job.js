const cron = require("node-cron");
const GroupAutoDeleteModel = require("../models/groupAutoDelete.model.js");
const Conversation = require("../models/conversation.model.js");
function startAutoDeleteJob() {
    cron.schedule("* * * * *", async () => {
        const now = new Date();
        try {

            const expiredDocs = await GroupAutoDeleteModel.find({ date: { $lte: now } });

            for (let doc of expiredDocs) {
                await Conversation.findByIdAndUpdate(
                    doc.conversationId,
                    { $pull: { participants: doc.userId } }
                );
                await GroupAutoDeleteModel.deleteOne({ _id: doc._id });

                console.log(`Auto-deleted conversation ${doc.conversationId} and rule ${doc._id}`);
            }
        } catch (err) {
            console.error("Cron job error:", err);
        }
    });


}

module.exports = startAutoDeleteJob;