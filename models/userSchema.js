const mongoose = require('mongoose');
const schema = mongoose.Schema;


const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    bookmarks: {
        type: Array,
        default: []
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;