const app = require("./app");
const { config } = require("./config/index");

app.listen(config.port, (req, res)=>{
    console.log(`Port is running on the ${config.port}`);
});