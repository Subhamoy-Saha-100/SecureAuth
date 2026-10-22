const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

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

const loginUser = async ({email, password}) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    }).select('+password');
    console.log(user);
    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    console.log(password);
    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );
    if (!passwordMatches) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    const accessToken = jwt.sign(
        { sub: user._id.toString() },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );
    
     return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    };
}

module.exports = { registerUser, loginUser };