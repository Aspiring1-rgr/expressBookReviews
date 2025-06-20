const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;
    if(books[isbn]){
      if(books[isbn].reviews[username]){
        books[isbn].reviews[username] = [review];
        return res.status(200).json({ message: "Review modified successfully" });
      }
      else{
        books[isbn].reviews[username] = [review];
        return res.status(200).json({ message: "Review added successfully" });
      }
    }
    else{
      return res.status(404).json({message: "No book found with ISBN "+isbn});
    }
  }
);

regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn; //Extract isbn from request URL
    let username = req.session.authorization.username; //Extract username from request
    if(books[isbn]){
        if(books[isbn].reviews[username]){
            // Delete reviews from 'boo
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully."});
        }
        else{
            return res.status(404).json({message: "No review found for ISBN "+isbn});
        }
    }
    else{
        return res.status(404).json({message: "No book found with ISBN "+isbn});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
