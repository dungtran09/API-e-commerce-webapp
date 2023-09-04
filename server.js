// config env node
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const dbConnect = require("./config/dbConnect");

// handler error syntax uncaughtException
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Error: uncaughtException: Shutting down application...");
  process.exit(1);
});

// connect database
dbConnect();

// create local server
const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT} (${app.get("env")} mode)`);
});

// handler connect error db: unHandlerRejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Error: unhandledRejection: Shutting down application...");
  server.close(() => {
    process.exit(1);
  });
});
