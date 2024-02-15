const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Book = require("../models/Book");
const Author = require("../models/Author");

// @desc      Get books
// @route     GET /api/v1/books
// @route     GET /api/v1/authors/:authorId/books
// @access    Public
exports.getBooks = asyncHandler(async (req, res, next) => {
  if (req.params.authorId) {
    const books = await Book.find({ author: req.params.authorId });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single a single book
// @route     GET /api/v1/books/:id
// @access    Public
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate({
    path: "author",
    select: "name country birthdate",
  });

  if (!book) {
    return next(new ErrorResponse(`No book with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      Add book
// @route     POST /api/v1/books
// @route     POST /api/v1/authors/:authorId/books
// @access    Public
exports.addBook = asyncHandler(async (req, res, next) => {
  if (req.params.authorId) {
    req.body.author = req.params.authorId;
  }

  const author = await Author.findById(req.body.author);

  if (!author) {
    return next(new ErrorResponse(`No author with the id of ${req.body.author}`, 404));
  }

  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    data: book,
  });
});

// @desc      Update book
// @route     PUT /api/v1/books/:id
// @access    Public
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorResponse(`No book with the id of ${req.params.id}`, 404));
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc      Delete book
// @route     DELETE /api/v1/books/:id
// @access    Public
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorResponse(`No book with the id of ${req.params.id}`, 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
