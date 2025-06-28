const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['youtube', 'mp4'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    videoPath: String,
    subtitlePath: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', VideoSchema);