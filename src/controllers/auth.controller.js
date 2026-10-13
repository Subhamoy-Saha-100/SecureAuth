
const { registerSchema } = require("../validators/auth.validator");
const { registerUser } = require("../services/auth.service");

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

module.exports = { register };
