const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Author = require("../models/Author");

// @desc      Get all authors
// @route     GET /api/v1/authors
// @access    Public
exports.getAuthors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single author
// @route     GET /api/v1/authors/:id
// @access    Public
exports.getAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    return next(new ErrorResponse(`Author not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: author });
});

// @desc      Create new author
// @route     POST /api/v1/authors
// @access    Public
exports.createAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.create(req.body);

  res.status(201).json({
    success: true,
    data: author,
  });
});

// @desc      Update author
// @route     PUT /api/v1/authors/:id
// @access    Public
exports.updateAuthor = asyncHandler(async (req, res, next) => {
  let author = await Author.findById(req.params.id);

  if (!author) {
    return next(new ErrorResponse(`Author not found with id of ${req.params.id}`, 404));
  }

  author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: author });
});

// @desc      Delete author
// @route     DELETE /api/v1/authors/:id
// @access    Public
exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    return next(new ErrorResponse(`Author not found with id of ${req.params.id}`, 404));
  }

  await author.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
