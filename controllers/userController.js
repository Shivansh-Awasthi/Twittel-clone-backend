const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const bcryptjs = require('bcryptjs')



const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;


        // basic validation

        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All Fields are require.",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists.",
                success: false
            })
        }


        const hashedPassword = await bcryptjs.hash(password, 16)

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created Successfully",
            success: true
        })




    } catch (error) {
        console.log(error)
    }
}



const Login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // basic validation

        if (!email || !password) {
            return res.status(401).json({
                message: "All Fields are require.",
                success: false
            })
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User does not exist.",
                success: false
            })
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong Password.",
                success: false
            })
        }


        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" })
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome Back ${user.name}`,
            user,
            success: true
        })


    } catch (error) {
        console.log(error)
    }
}



const Logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "User logged out successfully",
        success: true
    })
}



const bookmarks = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            //remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Bookamrk removed.",
            })
        }
        else {
            //add
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Bookmark added",
            })
        }
    } catch (error) {
        console.log(error)
    }
}




const getMyProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })

    } catch (error) {
        console.log(error);

    }
}


const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.body;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
        if (!otherUsers.length) {
            return res.status(401).json({
                message: "Currently do not have any users"
            });
        }
        return res.status(200).json({
            otherUsers
        });
    } catch (error) {
        console.log(error)
    }
}



const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;   // loggedIn user id
        const userId = req.params.id;      // other users id
        const loggedInUser = await User.findById(loggedInUserId);    //loggedIn user id
        const user = await User.findById(userId);    // other users id
        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        }
        else {
            return res.status(400).json({
                message: `User already followed ${user.name}`
            });
        }
        return res.status(200).json({
            message: `${loggedInUser.name} started following ${user.name}`,
            success: true
        });
    } catch (error) {

    }
}


const unfollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;   // loggedIn user id
        const userId = req.params.id;      // other users id
        const loggedInUser = await User.findById(loggedInUserId);    //loggedIn user id
        const user = await User.findById(userId);    // other users id
        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        }
        else {
            return res.status(400).json({
                message: `User has not followed yet `
            });
        }
        return res.status(200).json({
            message: `${loggedInUser.name} just unfollowed ${user.name}`,
            success: true
        });
    } catch (error) {

    }
}



module.exports = {
    Register,
    Login,
    Logout,
    bookmarks,
    getMyProfile,
    getOtherUsers,
    follow,
    unfollow
};



