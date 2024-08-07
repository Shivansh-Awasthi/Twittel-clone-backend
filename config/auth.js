const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const path = require('path');




const envPath = path.resolve(__dirname, '../.env');

dotenv.config({
    path: envPath
})


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}


module.exports = isAuthenticated