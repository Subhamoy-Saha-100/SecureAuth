const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth.route");

// security headers
app.use(helmet());

// parse incoming json
app.use(express.json());

// Configure CORS for our frontend
app.use(cors({
    origin: 'http://localhost:5000'
}));

app.get("/api/health", (req, res)=>{
    res.status(200).json({
        success: true,
        message: 'SecureAuth is running perfectly'
    });
});


// Routes
app.use('/api/auth', authRoutes);




module.exports = app;