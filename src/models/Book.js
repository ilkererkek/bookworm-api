const mongoose = require("mongoose");
const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add the title of the Book."],
    maxlength: [50, "The Book title can not be more than 50 characters."],
  },
  price: {
    type: Number,
    required: [true, "Please add a price for the Book."],
  },
  isbn: {
    type: String,
    required: [true, "Please add the ISBN code for the Book."],
  },
  language: {
    type: String,
    required: [true, "Please add the Book language."],
  },
  numberOfPages: {
    type: Number,
    required: [true, "Please add the Number of pages."],
    min: [0, "Number of pages can not be less than 0."],
  },
  publisher: {
    type: String,
    required: false,
    maxlength: [50, "The Book publisher can not be more than 50 characters."],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "Author",
    required: true,
  },
});

module.exports = mongoose.model("Book", BookSchema);
