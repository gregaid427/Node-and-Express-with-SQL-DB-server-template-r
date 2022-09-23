require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const userRouter = require("./api/users/user.router");
const projectRouter = require("./api/project/project.router");
const adminRouter = require("./api/admin/admin.router");
const keysRouter = require("./api/keys/keys.router");

app.use(express.json());
app.use(cors())
// app.use(function(req,res,next){
// res.header("Access-Control-Allow","*");
// res.header("Access-Control-Allow-Headers","X-Requested-With");
// })
app.use("/api/users", userRouter);
// app.use("/api/projects", projectRouter);
app.use("/api/admin", adminRouter);
app.use("/api/keys", keysRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});
