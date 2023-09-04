const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_REMOTE_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");
  } catch (error) {
    console.log("Database disconnected.");
    throw new Error(error.message);
  }
};

module.exports = dbConnect;
