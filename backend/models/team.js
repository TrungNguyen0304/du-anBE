const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: {
      type: String,
      default: ""
    },
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

const Team = mongoose.model("Team", teamSchema)
module.exports = Team;
