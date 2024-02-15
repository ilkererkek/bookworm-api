const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add an Author name."],
    maxlength: [50, "Author name can not be more than 50 characters."],
  },
  country: {
    type: String,
    required: [true, "Please add the Author country."],
    maxlength: [50, "Author country can not be more than 50 characters."],
  },
  birthDate: {
    type: Date,
    required: [true, "Please add an Author birthday."],
    //Validation for valid birthdate.
    validate: {
      validator: (v) => {
        return v < Date.now();
      },
      message: (props) => "Please add a valid date of birth for the Author.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Cascade delete books when an author is deleted
AuthorSchema.pre("deleteOne", { document: true }, async function (next) {
  await this.model("Book").deleteMany({ author: this._id });
  next();
});

AuthorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});

module.exports = mongoose.model("Author", AuthorSchema);
