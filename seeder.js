const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

dotenv.config({ path: "./src/config/config.env" });

const Author = require("./src/models/Author");
const Book = require("./src/models/Book");

const importData = async () => {
  try {
    const authors = JSON.parse(fs.readFileSync(`${__dirname}/_data/authors.json`, "utf-8"));
    const books = JSON.parse(fs.readFileSync(`${__dirname}/_data/books.json`, "utf-8"));

    await Author.create(authors);
    await Book.create(books);
    console.log("Data Imported...".green.inverse);
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await Author.deleteMany();
    await Book.deleteMany();
    console.log("Data Destroyed...".red.inverse);
  } catch (error) {
    console.error(error);
  }
};
const importDataCli = async () => {
  if (process.env.NODE_ENV !== "test") {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`, {});
  } else {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}-test`, {});
  }
  await importData();
  process.exit();
};

const deleteDataCli = async () => {
  if (process.env.NODE_ENV !== "test") {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`, {});
  } else {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}-test`, {});
  }
  await deleteData();
  process.exit();
};

if (process.argv[2] === "-i") {
  importDataCli().then();
} else if (process.argv[2] === "-d") {
  deleteDataCli().then();
}

module.exports = { importData, deleteData };
