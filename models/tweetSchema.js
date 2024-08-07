const mongoose = require('mongoose');
const schema = mongoose.Schema;


const tweetSchema = new schema({
    description: {
        type: String,
        required: true
    },
    like: {
        type: Array,
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });


const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;