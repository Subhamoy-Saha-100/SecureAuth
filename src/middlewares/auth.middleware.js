
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check whether the Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required',
            });
        }

        // Extract the token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify the token's signature and expiry
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // Attach the authenticated user's ID to the request
        req.user = {
            id: decoded.sub,
        };

        // Continue to the next middleware or controller
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token',
        });
    }
};

module.exports = authMiddleware;