const express = require('express');
const { createTweet, deleteTweet, likeOrDislike, getAllTweets, getFollowingTweets } = require('../controllers/tweetController');
const isAuthenticated = require('../config/auth');
const router = express.Router();



router.post('/create', isAuthenticated, createTweet);
router.delete('/delete/:id', deleteTweet);
router.put('/like/:id', isAuthenticated, likeOrDislike)
router.get('/alltweets/:id', isAuthenticated, getAllTweets)
router.get('/followingtweets/:id', isAuthenticated, getFollowingTweets)


module.exports = router;