const express = require("express");
const app = express();
const { connectDb } = require("./utils/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoutes");
const requestRouter = require("./routes/requestRoutes");
const profileRouter = require("./routes/profileRoutes");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("Database Connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.log(error));
