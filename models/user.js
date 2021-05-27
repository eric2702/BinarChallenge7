const mongoose = require('mongoose');

const UserCredSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true
    }
})

const UserCred = mongoose.model('User', UserCredSchema);

module.exports = UserCred;