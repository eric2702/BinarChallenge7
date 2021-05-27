const mongoose = require('mongoose');

const UserHistorySchema = new mongoose.Schema({
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const UserHistory = mongoose.model('History', UserHistorySchema);

module.exports = UserHistory;