const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../server");
const { importData, deleteData } = require("../seeder");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/config.env" });

chai.use(chaiHttp);

const apiURL = `http://localhost:${process.env.PORT}/api/v1`;

const authors = JSON.parse(fs.readFileSync(`${__dirname}/../_data/authors.json`, "utf-8"));
const books = JSON.parse(fs.readFileSync(`${__dirname}/../_data/books.json`, "utf-8"));

let connection;

const testAuthor = {
  _id: "65cd63c53fdcc29d277da13b",
  name: "Developer",
  country: "World",
  birthDate: "2001-08-17",
};
const testBook = {
  _id: "65cd6cbecfdcc402dfe17b12",
  title: "WebApp",
  price: 200,
  isbn: "978-3-16-148410-0",
  language: "English",
  numberOfPages: 1000,
  publisher: "Bookworm Press",
  author: "65cd1ce53b793fe0bedabd41",
};

describe("Bookworm API Integration tests:", () => {
  beforeAll(async () => {
    connection = (await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}-test`, {})).connection;
  });
  beforeEach(async () => {
    //Re-create database every test.
    await deleteData();
    await importData();
  });
  afterAll(async () => {
    //Delete the database after the tests.
    await deleteData();
    await server.close();
    await connection.close();
  });

  //Books tests

  describe("Books Routes tests:", () => {
    it("GET: /books Should get all the books", (done) => {
      chai
        .request(apiURL)
        .get("/books")
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data.map((book) => book._id)).to.have.members(books.map((book) => book._id));
          done();
        });
    });

    it("GET: /books/:id Should get the book with the id", (done) => {
      const id = books[0]._id;
      chai
        .request(apiURL)
        .get(`/books/${id}`)
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(id);
          done();
        });
    });

    it("POST: /books Should add a new book", (done) => {
      chai
        .request(apiURL)
        .post(`/books`)
        .send(testBook)
        .end((error, response) => {
          chai.expect(response).to.have.status(201);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(testBook._id);
          chai.expect(response.body.data.name).is.equal(testBook.name);
          done();
        });
    });

    it("PUT: /books/:id Should update existing book", (done) => {
      const book = books[0];
      chai
        .request(apiURL)
        .put(`/books/${book._id}`)
        .send({ title: testBook.title })
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(book._id);
          chai.expect(response.body.data.title).is.equal(testBook.title);
          done();
        });
    });

    it("DELETE: /books/:id Should delete existing book", (done) => {
      const id = books[7]._id;
      chai
        .request(apiURL)
        .delete(`/books/${id}`)
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);

          chai
            .request(apiURL)
            .get(`/books/${id}`)
            .end((error, response) => {
              chai.expect(response).to.have.status(404);
              chai.expect(response.body).to.exist;
              chai.expect(response.body.success).is.equal(false);
              done();
            });
        });
    });
  });
  //Authors tests
  describe("Author Routes tests:", () => {
    it("GET: /authors Should get all the authors", (done) => {
      chai
        .request(apiURL)
        .get("/authors")
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data.map((author) => author._id)).to.have.members(authors.map((author) => author._id));
          done();
        });
    });

    it("GET: /authors/:id Should get the author with the id", (done) => {
      const id = authors[0]._id;
      chai
        .request(apiURL)
        .get(`/authors/${id}`)
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(id);
          done();
        });
    });

    it("POST: /authors Should add a new author", (done) => {
      chai
        .request(apiURL)
        .post(`/authors`)
        .send(testAuthor)
        .end((error, response) => {
          chai.expect(response).to.have.status(201);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(testAuthor._id);
          chai.expect(response.body.data.name).is.equal(testAuthor.name);
          done();
        });
    });

    it("PUT: /authors/:id Should update existing author", (done) => {
      const author = authors[0];
      chai
        .request(apiURL)
        .put(`/authors/${author._id}`)
        .send({ country: testAuthor.country })
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);
          chai.expect(response.body.data._id).is.equal(author._id);
          chai.expect(response.body.data.country).is.equal(testAuthor.country);
          done();
        });
    });

    it("DELETE: /authors/:id Should delete existing author", (done) => {
      const id = authors[0]._id;
      chai
        .request(apiURL)
        .delete(`/authors/${id}`)
        .end((error, response) => {
          chai.expect(response).to.have.status(200);
          chai.expect(response.body).to.exist;
          chai.expect(response.body.success).is.equal(true);

          chai
            .request(apiURL)
            .get(`/authors/${id}`)
            .end((error, response) => {
              chai.expect(response).to.have.status(404);
              chai.expect(response.body).to.exist;
              chai.expect(response.body.success).is.equal(false);
              done();
            });
        });
    });
  });
});
