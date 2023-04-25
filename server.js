// Import modules as required (e..gf http)

// Express framework, node.js path module, mySQL module, cookie parser
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");

// Instance of express
let app = express();

// Express session module to manage user session
const session = require("express-session");

// BodyParser for parsing incoming request bodies
const bodyParser = require("body-parser");

//middleware goes here

app.use(
  session({
    secret: "ABlakley02Web",

    saveUninitialized: true,

    cookie: { maxAge: halfDay },

    resave: false,
  })
);

// creating connection to mySQL database

const connection = mysql.createConnection({
  host: "localhost",

  user: "root",

  password: "",

  database: "stacksofwax",

  port: "3306",

  multipleStatements: true,
});

// Connecting to the database

connection.connect((err) => {
  if (err) return console.log(err.message);

  console.log("connected to local mysql db");
});

// Querying the records table in the database


