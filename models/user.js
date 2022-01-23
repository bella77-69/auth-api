const mongoose = require('mongoose');

//create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // date: {
    //     type: Date,
    //     default: Date.now
    // }
});

module.exports = User = mongoose.model("user", userSchema);