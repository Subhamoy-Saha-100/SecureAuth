
const { registerSchema } = require("../validators/auth.validator");
const { registerUser } = require("../services/auth.service");

const { loginSchema } = require('../validators/auth.validator');
const { loginUser } = require('../services/auth.service');
const User = require('../models/user.model');

const register = async (req, res) => {
    try {
        // 1. Validate incoming request data
        const result = registerSchema.safeParse(req.body);
  
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        // 2. Register the user
        const user = await registerUser(result.data);
        
        // 3. Return successful response
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: { user },
        });

    } catch (error) {
        // 4. Handle duplicate email errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        // 5. Handle known registration errors
        if (error.statusCode === 409) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        // 6. Handle unexpected errors
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }

        const data = await loginUser(result.data);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data,
        });
    } catch (error) {
        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        console.error('Login error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        console.error('Get profile error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};