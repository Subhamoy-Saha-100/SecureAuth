const app = require("./app");
const { config } = require("./config/index");
const { connectDB } = require("./config/db");

const startServer = async ()=> {
    await connectDB();
    app.listen(config.port, (req, res)=>{
        console.log(`Port is running on the ${config.port}`);
    });
}

startServer();