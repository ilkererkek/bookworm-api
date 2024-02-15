const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
//Set environment config
dotenv.config({ path: "./src/config/config.env" });

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/error");

//connectDb
if (process.env.NODE_ENV !== "test") {
  connectDB();
}
//Routes
const authors = require("./src/routes/authors");
const books = require("./src/routes/books");

const app = express();

app.use(express.json());

//Logging for dev and test environments
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
}
//Serve documentation files.
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/api/v1/authors", authors);
app.use("/api/v1/books", books);

//Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});

module.exports = { app, server };
