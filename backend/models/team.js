const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assignedLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: false
      },
      assignedMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: false
      },
]})

const Taem = mongoose.model("Taem", teamSchema)
module.exports = Taem;
