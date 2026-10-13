const mongoose = require("mongoose");
const { trim, lowercase } = require("zod");

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    }
});

const user = mongoose.model("User", userSchema);
module.exports = user;