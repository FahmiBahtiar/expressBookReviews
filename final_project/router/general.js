const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchBooks = [];
  for(let key in books) {
      if(books[key].author === author) {
          matchBooks.push(books[key]);
      }
  }
  if(matchBooks.length > 0){
      return res.status(200).json(matchBooks);
  } else {
      return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchBooks = [];
  for(let key in books) {
      if(books[key].title === title) {
          matchBooks.push(books[key]);
      }
  }
  if(matchBooks.length > 0){
      return res.status(200).json(matchBooks);
  } else {
      return res.status(404).json({message: "No books found for this title"});
  }
});

//  Get book review
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

// Task 10-13: Client-side logic using Axios (Async/Await)
// Note: These functions are intended to be used by a client application or script, 
// but are included here as per the assignment instructions to have them in general.js.

const axios = require('axios');

const getBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get('http://localhost:5000/isbn/' + isbn);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getBookByAuthor = async (author) => {
    try {
        const response = await axios.get('http://localhost:5000/author/' + author);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const getBookByTitle = async (title) => {
    try {
        const response = await axios.get('http://localhost:5000/title/' + title);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getBooks = getBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;
