const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  assignedMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: false
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", 
    required: false
  },
  deadline: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ["draft", "in_progress", "completed", "cancelled","pending","revoked"],
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


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;