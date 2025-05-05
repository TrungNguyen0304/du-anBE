const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team", 
    required: false
  },
  deadline: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ["draft", "in_progress", "completed", "cancelled","pending"],
    default: "draft"
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    default: 2
  },
}, {
  timestamps: true 
});


const Project = mongoose.model("Project", projectSchema);

module.exports = Project;