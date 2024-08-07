const express = require('express');
const app = express();
const dotenv = require('dotenv');
const createDB = require('./config/database');
const userRoute = require('./routes/userRoute');
const tweetRoute = require('./routes/tweetRoute');
const cookieParser = require('cookie-parser');
const port = process.env.PORT
const cors = require('cors')


dotenv.config({
    path: ".env"
})

createDB();


// middlewares
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());



//Routes


app.use('/api/v1/user', userRoute)
app.use('/api/v1/tweet', tweetRoute)






app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})


