const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Retrieve the author parameter from the request URL
  const author = req.params.author;
  //Create an array of all books created by the author
  let booksByAuthor = [];
  for(let isbn in books){
    if(books[isbn].author == author) {
        booksByAuthor.push(books[isbn]);
    }
  //Check to see if there are any objects in the array. If there are, send them via JSON.stringify method. If not, return an error.
  }
  if(booksByAuthor.length>0) {
    return res.status(200).send(JSON.stringify(booksByAuthor,null,4));
  }
  else{
    return res.status(404).send("No book found with author "+author);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Retrieve the title parameter from the request URL
  const title = req.params.title;
  //Create an array of all books with that title
  let booksByTitle = [];
  for(let isbn in books){
    if(books[isbn].title == title) {
        booksByTitle.push(books[isbn]);
    }
  //Check to see if there are any objects in the array. If there are, send them via JSON.stringify method. If not, return an error.
  }
  if(booksByTitle.length>0) {
    return res.status(200).send(JSON.stringify(booksByTitle,null,4));
  }
  else{
    return res.status(404).send("No book found with title "+title);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
  }
  else{
    return res.status(404).send("No book found with ISBN "+isbn);
  }
});

module.exports.general = public_users;
