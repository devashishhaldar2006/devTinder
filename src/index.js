const express = require("express");
const app = express();
const { connectDb } = require("./utils/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoutes");
const requestRouter = require("./routes/requestRoutes");
const profileRouter = require("./routes/profileRoutes");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb()
  .then(() => {
    console.log("Database Connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.log(error));
