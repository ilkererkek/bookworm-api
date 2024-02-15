const express = require("express");
const { getBooks, getBook, addBook, updateBook, deleteBook } = require("../controllers/books");

const Book = require("../models/Book");
//Merge parameters for rerouting.
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Book, {
      path: "author",
      select: "name country birthDate",
    }),
    getBooks
  )
  .post(addBook);

router.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
