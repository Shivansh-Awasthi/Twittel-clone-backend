const Tweet = require("../models/tweetSchema");
const User = require("../models/userSchema");

const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required",
                status: false
            })
        }

        await Tweet.create({
            description,
            userId: id
        })
        return res.status(201).json({
            message: "Tweet created successfully",
            status: true
        })

    } catch (error) {
        console.log(error);
    }
}



const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Tweet deleted duccessfully",
            status: true
        })

    } catch (error) {
        console.log(error)

    }

}



const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if (tweet.like.includes(loggedInUserId)) {
            //dislike
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
            return res.status(200).json({
                message: "User disliked your tweet",
            })
        }
        else {
            //like
            await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
            return res.status(200).json({
                message: "User liked your tweet",
                status: true
            })
        }
    } catch (error) {
        console.log(error)
    }
}


const getAllTweets = async (req, res) => {

    // logged in user ka tweet + following user's tweet to display
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({ userId: id });
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {
            return Tweet.find({ userId: otherUsersId });
        }))
        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweet)
        })

    } catch (error) {
        console.log(error);
    }

}



const getFollowingTweets = async (req, res) => {

    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {
            return Tweet.find({ userId: otherUsersId });
        }))
        return res.status(200).json({
            tweets: [].concat(...followingUserTweet)
        })

    } catch (error) {
        console.log(error);
    }

}








module.exports = { createTweet, deleteTweet, likeOrDislike, getAllTweets, getFollowingTweets }