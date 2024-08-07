const express = require('express');
const { Register, Login, Logout, bookmarks, getMyProfile, getOtherUsers, follow, unfollow } = require('../controllers/userController');
const isAuthenticated = require('../config/auth');
const router = express.Router();




router.post('/register', Register)
router.post('/login', Login)
router.get('/logout', Logout)
router.put('/bookmark/:id', isAuthenticated, bookmarks)
router.get('/profile/:id', isAuthenticated, getMyProfile)
router.get('/otheruser/:id', isAuthenticated, getOtherUsers)
router.post('/follow/:id', isAuthenticated, follow)
router.post('/unfollow/:id', isAuthenticated, unfollow)



module.exports = router;