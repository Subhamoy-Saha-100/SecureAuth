const bcrypt = require("bcrypt");
const User = require('../models/user.model');

const registerUser = async ({name, email, password}) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    const existingUser = await User.findOne({
        email: normalizedEmail
    })

    if(existingUser){
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
};

module.exports = { registerUser };