const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;

    if (!uri) {
      throw new Error("MONGO_DB_URI environment variable is not set");
    }

    await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDb };