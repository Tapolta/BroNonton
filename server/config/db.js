const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bro_nonton', {
            dbName: 'bro_nonton',
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

module.exports = connectDB;