const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.resolve(__dirname, '../.env');


dotenv.config({
    path: envPath
});


createDB().then(() => {
    console.log('Server is connected')
})
    .catch(err => console.log(err));

async function createDB() {
    await mongoose.connect(process.env.MONGO_URL);

}



module.exports = createDB;
