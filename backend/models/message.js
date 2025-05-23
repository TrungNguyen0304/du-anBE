const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },

})

const Message = mongoose.model("Message", messageSchema)
module.exports = Message;
