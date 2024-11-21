const mongoose = require('mongoose');


require('dotenv').config();

const mongoConnection = async () => {
    try {
        const mongoURL = process.env.MONGO_URL; 
        await mongoose.connect(mongoURL);
        console.log('DB connected successfully');
    } catch (error) {
        console.error(`DB connection error: ${error}`);
        process.exit(1); // Exit process on error
    }
};

module.exports = { mongoConnection };