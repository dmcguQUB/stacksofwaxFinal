//<!-- index.js file -->

//In this code, we are importing some Node.js packages that help with building web applications using Express framework.
//express: A web application framework for Node.js. We create an instance of Express using let app = express();.
const express = require("express"); // import Express framework
//cookie-parser: A middleware for parsing cookies in the HTTP header. We use app.use(cookieParser()); to enable this middleware.
const cookieParser = require("cookie-parser"); // import cookie-parser middleware
//express-session: A middleware for creating sessions for users. We use app.use(sessions({ ... })) to configure session handling.
/* Yes, in your example the session information is stored locally in the server's memory, rather than being stored in a database. This is achieved using the express-session middleware, which provides an easy way to manage session data in Node.js applications. The session data is stored in memory by default, but you can configure express-session to use other storage options such as databases, if required.
*/
const sessions = require("express-session"); // import express-session middleware
let app = express(); // create an instance of Express
//path: A Node.js module for working with file and directory paths.
const path = require("path"); // import path module
//connection: A custom module for connecting to a database.
const connection = require("./connection.js"); // import database connection

//We also define some constants, including the port number and a time constant for session expiration.
const PORT = process.env.PORT || 3000; // define the port as a constant
const halfDay = 1000 * 60 * 60 * 12; // the constant for half a day for a session

// Middleware
//express.static: This middleware is used to serve static files, such as HTML, CSS, and JavaScript files, from a directory. We use app.use(express.static(path.join(__dirname, "./public"))); to serve static files from the 'public' folder.
app.use(express.static(path.join(__dirname, "./public"))); // serve static files from the 'public' folder
//express.urlencoded: This middleware is used to parse incoming form data. We use app.use(express.urlencoded({ extended: false })); to enable this middleware.
app.use(express.urlencoded({ extended: false })); // add this line to parse incoming form data
//app.set("view engine", "ejs"): This line sets the view engine for our app to be EJS (Embedded JavaScript). This means we can use EJS templates to render HTML dynamically.
app.set("view engine", "ejs"); // set the view engine to EJS

app.use(cookieParser()); // Use cookie-parser middleware

// Setting up a session
// In this code, a session is being set up using the express-session middleware. A session is a way to store user data temporarily, and it is used to maintain state across multiple requests.
// The sessions() method is used to configure the session middleware. Here, a secret key is set for the session, and the cookie is set to expire after half a day. saveUninitialized is set to true to save new, uninitialized sessions, and resave is set to false to avoid creating unnecessary session updates.
// The checkAuthenticated() function is a middleware function that checks if the user is authenticated or not. If the user is authenticated, the function calls the next() function, which passes control to the next middleware function. If the user is not authenticated, the function redirects the user to the login page. This function can be used in routes that require authentication to protect those routes from unauthorized access.
// //explained here https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(
  sessions({
    secret: "thisismysecrctekey599",
    saveUninitialized: true,
    cookie: { maxAge: halfDay },
    resave: false,
  })
);

// Function to check user authentication
function checkAuthenticated(req, res, next) {
  if (req.session && req.session.authen) {
    return next(); // passed back to sessions middleware
  }
  res.redirect("/login"); // if not autheticated then redirected to login
}

/*
This is a function to filter vinyl records in a database based on genre and artist. 
*/
function getFilteredRecords(genre, artist) {
  let queryConditions = []; // define an empty array called queryConditions
  let values = []; // define an empty array called values

  //SQL query for the database which will get necessary data from record, artist and genre tables within stacksofwax database
  let baseQuery = `
    SELECT 
      record.record_title, 
      record.record_image_url, 
      record.record_duration, 
      artist.artist_name, 
      genre.genre_title
    FROM 
      artist 
      JOIN record_artist ON artist.artist_id = record_artist.artist_id 
      JOIN record ON record.record_id = record_artist.record_id 
      JOIN record_genre ON record_genre.record_id = record.record_id 
      JOIN genre ON genre.genre_id = record_genre.genre_id
  `;

  //check if genre parameters are provided. If they are adds WHERE clause to the queryconditions array and the parameter to the values array
  if (genre) {
    queryConditions.push("genre.genre_id LIKE ?");
    values.push(`%${genre}%`);
  }
  //check if artist parameters are provided. If they are adds WHERE clause to the queryconditions array and the parameter to the values array
  if (artist) {
    queryConditions.push("artist.artist_id LIKE ?");
    values.push(`%${artist}%`);
  }
//Essentially, this adds a WHERE clause to the SQL query built in baseQuery only if there are query conditions to be applied.
  if (queryConditions.length > 0) {
    baseQuery += " WHERE " + queryConditions.join(" AND ");
  }

  // Finally, it returns a Promise object that queries the database using the modified SQL query and parameter values. If the query is successful, it resolves with the resulting rows, and if it fails, it rejects with an error.
  return new Promise((resolve, reject) => {
    connection.query(baseQuery, values, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/* Route for homepage. If the user is autheticated (logged in correctly) the code retrieves the use data and then renders the index.ejs file. The code passes the object user data to be viewed on the page. It also converts the autheticated boolean to true
If user does not sign in (authenticate) then the user is directed to index page but authentification is set to false.
*/ 
app.get("/", function (req, res) {
  if (req.session && req.session.authen) {
    let uid = req.session.authen;
    let user = "SELECT * FROM user WHERE user_id = ?";
    connection.query(user, [uid], (err, row) => {
      if (err) throw err;
      let firstrow = row[0];
      res.render("index", { userdata: firstrow, isAuthenticated: true });
    });
  } else {
    res.render("index", { isAuthenticated: false });
  }
});

// Route for the account page
app.get("/account", checkAuthenticated, function (req, res) {
  let uid = req.session.authen;
  let user = "SELECT * FROM user WHERE user_id = ?";
  connection.query(user, [uid], (err, row) => {
    if (err) throw err;
    let firstrow = row[0];
    res.render("account", { userdata: firstrow, isAuthenticated: true });
  });
});

// Route for the discover page
//This defines an Express.js GET route for the "/discover" endpoint. When a client makes a GET request to this endpoint, the callback function passed as the second argument is called.


// Route for the discover page
app.get("/discover", function (req, res) {
  // Check if user is authenticated
  let isAuthenticated = req.session && req.session.authen;

  // Initialize variables for user data, genre, and artist
  let userdata = null;
  let genre = req.query.genre || "";
  let artist = req.query.artist || "";

  // SQL query to select specific columns from the record, artist, and genre tables and join them together
  // WHERE clause filters the results based on the genre and artist parameters in the request
  let sqlquery = `SELECT 
    record.record_title, 
    record.record_image_url, 
    record.record_duration, 
    artist.artist_name, 
    genre.genre_title 
  FROM 
    artist 
    JOIN record_artist ON artist.artist_id = record_artist.artist_id 
    JOIN record ON record.record_id = record_artist.record_id 
    JOIN record_genre ON record_genre.record_id = record.record_id 
    JOIN genre ON genre.genre_id = record_genre.genre_id 
    WHERE genre.genre_title LIKE ? AND artist.artist_name LIKE ?`;

  // Array of parameter values to be used in the SQL query
  // The % characters are wildcards that allow for partial matches on the genre and artist columns
  let values = [`%${genre}%`, `%${artist}%`];

  // If user is authenticated, retrieve user data from the user table based on the user_id stored in the session object
  if (isAuthenticated) {
    let uid = req.session.authen;
    let user = "SELECT * FROM user WHERE user_id = ?";
    connection.query(user, [uid], (err, row) => {
      if (err) throw err;
      // Store retrieved user data in userdata variable
      userdata = row[0];
    });
  }

  // Execute SQL query with parameter values
  connection.query(sqlquery, values, function (err, rows) {
    if (err) throw err;

    // Limit the records displayed based on authentication status
    // If user is authenticated, display all rows, otherwise display only the first 5 rows
    let displayedRecords = isAuthenticated ? rows : rows.slice(0, 5);

    // Generate HTML response using the discover.ejs template and the data provided in the object passed as the second argument
    res.render("discover", {
      record: displayedRecords,
      genre: genre,
      artist: artist,
      isAuthenticated: isAuthenticated,
      userdata: userdata,
    });
  });
});



// Route for the login page
app.get("/login", function (req, res) {
  res.render("login");
});

// route to check in login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the database and if the password matches
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0 && results[0].password === password) {
        // If email and password match, set session variables and redirect
        req.session.authen = results[0].user_id;
        res.redirect("/");
      } else {
        // If email or password doesn't match, render the login page with an error message
        res.render("login", { errorMessage: "Incorrect email or password." });
      }
    }
  );
});

//route to get register page
app.get("/register", function (req, res) {
  let errorMessage = "";
  let firstName = "";
  let lastName = "";
  let email = "";

  res.render("register", { errorMessage, firstName, lastName, email });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;
  let errorMessage = '';

  // Check for empty fields
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    errorMessage = 'All fields are required.';
    return res.render('register', { errorMessage, firstName, lastName, email });
  }

  // Check for password mismatch
  if (password !== passwordConfirm) {
    errorMessage = 'Passwords do not match.';
    return res.render('register', { errorMessage, firstName, lastName, email });
  }

  // Check if the email already exists in the database
  connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error registering the user');
    }

    if (results.length > 0) {
      errorMessage = 'Email already exists.';
      return res.render('register', { errorMessage, firstName, lastName, email });
    }

    // If all validation passes, insert the new user into the database
    const insertUserQuery = `
      INSERT INTO user (first_name, last_name, email, password)
      VALUES (?, ?, ?, ?)
    `;
    connection.query(insertUserQuery, [firstName, lastName, email, password], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error registering the user');
      }

      // Redirect the user to the login page or any other page if you want
      return res.redirect('/login');
    });
  });
});


// Route for the terms page
app.get("/terms", function (req, res) {
  res.render("terms");
});

// Route for the privacy page
app.get("/privacy", function (req, res) {
  res.render("privacy");
});

// Route for the faq page
app.get("/faq", function (req, res) {
  res.render("faq");
});

// Route for the about page
app.get("/about", function (req, res) {
  res.render("about");
});

// Route for the contact us page
app.get("/contactus", function (req, res) {
  res.render("contactus");
});

// Route for the logout
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

// Route to handle the like action
app.post("/like", (req, res) => {
  // Retrieve user_id and record_id from the request body
  const { user_id, record_id } = req.body;

  // Insert the user_id and record_id into the user_liked_records table
  // Replace 'connection' with your database connection variable
  connection.query(
    "INSERT INTO user_liked_records (user_id, record_id) VALUES (?, ?)",
    [user_id, record_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error saving the like");
      } else {
        res.status(200).send("Like saved successfully");
      }
    }
  );
});

// Route for the pricing page
app.get("/pricing", function (req, res) {
  res.render("pricing");
});

//create separate routes in your index.js file to fetch genres and artists from the database:
app.get('/genres', (req, res) => {
  connection.query('SELECT * FROM genre ORDER BY genre_title ASC', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching genres');
    }
    res.json(results);
  });
});
//create separate routes in your index.js file to fetch genres and artists from the database:

app.get('/artists', (req, res) => {
  connection.query('SELECT * FROM artist ORDER BY artist_name ASC', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching artists');
    }
    res.json(results);
  });
});

//In your routes/index.js (or the relevant route file), create a new route for fetching filtered records. The route should accept query parameters for each filter.
app.get('/filteredRecords', async (req, res) => {
  const { genre, artist, likes, song } = req.query;
  console.log('Filter values:', { genre, artist, likes, song });
  // Fetch filtered records from the database based on the query parameters
  const filteredRecords = await getFilteredRecords(genre, artist, likes, song);
  res.json(filteredRecords);
});


// Start listening for incoming requests on the defined port
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}: http://localhost:${PORT}`);
});
