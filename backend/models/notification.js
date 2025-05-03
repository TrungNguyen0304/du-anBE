const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reportDate: {
        type: Date,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: { type: Number, default: 0 },
}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;