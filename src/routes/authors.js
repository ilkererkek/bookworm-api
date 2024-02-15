const express = require("express");
const { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor } = require("../controllers/authors");

const Author = require("../models/Author");

// Include other resource routers
const booksRouter = require("./books");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");

// Re-route into books router
router.use("/:authorId/books", booksRouter);

router.route("/").get(advancedResults(Author, "books"), getAuthors).post(createAuthor);

router.route("/:id").get(getAuthor).put(updateAuthor).delete(deleteAuthor);

module.exports = router;
