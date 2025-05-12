const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    difficulties: {
        type: String,
        required: true
    },
    taskProgress: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    assignedMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    feedback: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
        default: null
    }
});

module.exports = mongoose.model('Report', reportSchema);
