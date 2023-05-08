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

//import bycrypt library to hash user information stored in database
const bcrypt = require("bcrypt");
const saltRounds = 10; // increased value here means greater hashing but also slower
//We also define some constants, including the port number and a time constant for session expiration.

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

// Route for the discover page
//This defines an Express.js GET route for the "/discover" endpoint. When a client makes a GET request to this endpoint, the callback function passed as the second argument is called.

// Route for the discover page
app.get("/discover", function (req, res) {
  let genre = req.query.genre || "";
  let artist = req.query.artist || "";
  let isAuthenticated = req.session && req.session.authen;

  //Distinct used to prevent duplicates
  let sql = `SELECT DISTINCT
  record.record_id,
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
WHERE genre.genre_title LIKE ? AND artist.artist_name LIKE ?;`;

  // Query to fetch genres
  let genreSql = "SELECT * FROM genre ORDER BY genre_title ASC";
  // Query to fetch artists
  let artistSql = "SELECT * FROM artist ORDER BY artist_name ASC";

  connection.query(sql, [`%${genre}%`, `%${artist}%`], function (err, rows) {
    if (err) throw err;

    // Execute the queries in parallel
    connection.query(genreSql, function (err, genres) {
      if (err) throw err;
      connection.query(artistSql, function (err, artists) {
        if (err) throw err;

        // Render the discover template with genres and artists
        res.render("discover", {
          record: rows,
          genres: genres,
          artists: artists,
          isAuthenticated: isAuthenticated,
          userdata: req.user,
          genre: genre,
          artist: artist,
        });
      });
    });
  });
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

      if (results.length > 0) {
        // Compare the submitted password with the stored hashed password using bcrypt
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error comparing the passwords");
          }

          if (isMatch) {
            // If email and password match, set session variables and redirect
            req.session.authen = results[0].user_id;
            res.redirect("/");
          } else {
            // If the passwords don't match, render the login page with an error message
            res.render("login", {
              errorMessage: "Incorrect email or password.",
              isAuthenticated: false,
            });
          }
        });
      } else {
        // If the email doesn't exist, render the login page with an error message
        res.render("login", {
          errorMessage: "Incorrect email or password.",
          isAuthenticated: false,
        });
      }
    }
  );
});

// Route for the login page
app.get("/login", function (req, res) {
  res.render("login", { isAuthenticated: false });
});

//route to get register page
app.get("/register", function (req, res) {
  let errorMessage = "";
  let firstName = "";
  let lastName = "";
  let email = "";

  res.render("register", {
    errorMessage,
    firstName,
    lastName,
    email,
    isAuthenticated: false,
  });
});

app.post("/register", (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;
  let errorMessage = "";

  // Check for empty fields
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    errorMessage = "All fields are required.";
    return res.render("register", {
      errorMessage,
      firstName,
      lastName,
      email,
      isAuthenticated: false,
    });
  }

  // Check for password mismatch
  if (password !== passwordConfirm) {
    errorMessage = "Passwords do not match.";
    return res.render("register", {
      errorMessage,
      firstName,
      lastName,
      email,
      isAuthenticated: false,
    });
  }

  // Check if the email already exists in the database
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Error registering the user");
      }

      if (results.length > 0) {
        errorMessage = "Email already exists.";
        return res.render("register", {
          errorMessage,
          firstName,
          lastName,
          email,
          isAuthenticated: false,
        });
      }

      // Hash the password before inserting the user into the database
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error hashing the password");
        }

        // If all validation passes, insert the new user into the database with the hashed password
        const insertUserQuery = `
        INSERT INTO user (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?)
      `;
        connection.query(
          insertUserQuery,
          [firstName, lastName, email, hash],
          (error, results) => {
            if (error) {
              console.error(error);
              return res.status(500).send("Error registering the user");
            }

            // Redirect the user to the login page or any other page if you want
            return res.redirect("/login");
          }
        );
      });
    }
  );
});

// Route for the terms page
app.get("/terms", function (req, res) {
  res.render("terms", { isAuthenticated: false });
});

// Route for the privacy page
app.get("/privacy", function (req, res) {
  res.render("privacy", { isAuthenticated: false });
});

// Route for the faq page
app.get("/faq", function (req, res) {
  res.render("faq", { isAuthenticated: false });
});

// Route for the about page
app.get("/about", function (req, res) {
  res.render("about", { isAuthenticated: false });
});

// Route for the contact us page
app.get("/contactus", function (req, res) {
  res.render("contactus", { isAuthenticated: false });
});

// Route for the logout
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});
// Route to handle add to playlist
app.post("/add-to-playlist", checkAuthenticated, (req, res) => {
  const userId = req.session.authen; // Get the user ID from the session
  const { record_id } = req.body; // Get the record ID from the submitted form

  console.log("Add-to-playlist record_id:", record_id); // Add this line to check the value

  // Validate the record ID
  if (isNaN(record_id) || record_id < 1) {
    res.status(400).send("Invalid record ID");
    return;
  }

  // Insert the user ID and record ID into the user_liked_records table
  connection.query(
    "INSERT INTO user_playlist (user_id, record_id) VALUES (?, ?)",
    [userId, record_id],
    (error, results) => {
      if (error) throw error;
      res.redirect("/discover"); // Redirect to the myplaylist page
    }
  );
});

// Route to handle the unlike action
app.post("/remove-from-playlist", checkAuthenticated, (req, res) => {
  const userId = req.session.authen; // Get the user ID from the session
  const { record_id } = req.body; // Get the record ID from the submitted form

  console.log("Remove-from-playlist record_id:", record_id); // Add this line to check the value

  // Validate the record ID
  if (isNaN(record_id) || record_id < 1) {
    res.status(400).send("Invalid record ID");
    return;
  }

  // Delete the user's like for the specified record
  connection.query(
    "DELETE FROM user_playlist WHERE user_id = ? AND record_id = ?",
    [userId, record_id],
    (error, results) => {
      if (error) throw error;
      res.redirect("/myplaylist"); // Redirect to the myplaylist page
    }
  );
});

// Route for the myplaylist page
app.get("/myplaylist", function (req, res) {
  let isAuthenticated = req.session && req.session.authen;

  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }

  let userid = req.session.authen;

  // SQL queru allows records to be grouped by record ID to prevent duplicates as they have multiple genres
  let sql = `SELECT 
  record.record_id,
  record.record_title,
  record.record_image_url,
  record.record_duration,
  artist.artist_name,
  GROUP_CONCAT(DISTINCT genre.genre_title SEPARATOR ', ') as genre_title
FROM 
  artist
  JOIN record_artist ON artist.artist_id = record_artist.artist_id
  JOIN record ON record.record_id = record_artist.record_id
  JOIN record_genre ON record_genre.record_id = record.record_id
  JOIN genre ON genre.genre_id = record_genre.genre_id
  JOIN user_playlist ON record.record_id = user_playlist.record_id
WHERE
  user_playlist.user_id = ?
GROUP BY
  record.record_id, artist.artist_name`;

  let values = [userid];

  connection.query(sql, values, function (err, rows) {
    if (err) throw err;
    res.render("myplaylist", {
      record: rows,
      isAuthenticated: isAuthenticated,
      userdata: req.user,
    });
  });
});

// Route for the pricing page
app.get("/pricing", function (req, res) {
  res.render("pricing", { isAuthenticated: false });
});


// Collections page for user playlists
app.get("/collections", function (req, res) {
  if (!req.session || !req.session.authen) {
    res.redirect("/login");
    return;
  }

  let isAuthenticated = true;
  let userId = req.session.authen;
  console.log(userId);

  let collectionsQuery = `
  SELECT 
    user_playlist.user_id,
    user.first_name,
    user.last_name,
    COUNT(user_playlist.record_id) AS record_count,
    (
      SELECT COUNT(*) 
      FROM collection_likes 
      WHERE liked_user_id = user_playlist.user_id
    ) AS like_count,
    (
      SELECT COUNT(*) 
      FROM collection_likes
      WHERE user_id = ? AND liked_user_id = user_playlist.user_id
    ) AS has_liked
  FROM
    user_playlist
  JOIN
    user ON user_playlist.user_id = user.user_id
  GROUP BY
    user_playlist.user_id;
  `;

  // query for fetching comments for users
  let commentsQuery = `
  SELECT
    cc.commenter_id,
    u.first_name as commenter_first_name,
    u.last_name as commenter_last_name,
    cc.playlist_creator_id,
    cc.comment,
    cc.created_at
  FROM
    collection_comments cc
  JOIN
    user u ON cc.commenter_id = u.user_id
  WHERE
    cc.playlist_creator_id IN (
      SELECT DISTINCT
        user_playlist.user_id
      FROM
        user_playlist
    );
  `;

  connection.query(collectionsQuery, [userId], (err, userCollections) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving user collections");
      return;
    }

    // Execute the commentsQuery inside the collectionsQuery callback
    connection.query(commentsQuery, (err, comments) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving comments");
        return;
      }

      // Pass both userCollections and comments to the template
      res.render("collections", {
        userCollections: userCollections,
        comments: comments,
        isAuthenticated: isAuthenticated,
        userId: userId,
      });
    });
  });
});

//add comment section route
app.post("/add-comment", (req, res) => {
  const commenterId = req.body.commenter_id;
  const playlistCreatorId = req.body.playlist_creator_id;
  const comment = req.body.comment;

  connection.query(
    "INSERT INTO collection_comments (commenter_id, playlist_creator_id, comment) VALUES (?, ?, ?)",
    [commenterId, playlistCreatorId, comment],
    (error, results) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .send("Error inserting new comment into collection_comments table");
        return;
      }

      res.redirect("/collections");
    }
  );
});

app.get("/collection/:userId", (req, res) => {
  let isAuthenticated = req.session && req.session.authen;
  let userId = req.params.userId;
  let query = `
  SELECT record.*, GROUP_CONCAT(DISTINCT artist.artist_name SEPARATOR ', ') as artist_names, GROUP_CONCAT(DISTINCT genre.genre_title SEPARATOR ', ') as genre_titles
  FROM user_playlist
  JOIN record ON user_playlist.record_id = record.record_id
  JOIN record_artist ON record.record_id = record_artist.record_id
  JOIN artist ON record_artist.artist_id = artist.artist_id
  JOIN record_genre ON record.record_id = record_genre.record_id
  JOIN genre ON record_genre.genre_id = genre.genre_id
  WHERE user_playlist.user_id = ?
  GROUP BY record.record_id, artist.artist_id;`;

  connection.query(query, [userId], (err, records) => {
    if (err) throw err;
    res.render("user_collection", {
      records,
      isAuthenticated: isAuthenticated,
    });
  });
});

// Like a collection
app.post("/like-collection", (req, res) => {
  // Retrieve the user ID and collection ID from the request body
  const userId = req.body.user_id;
  const likedUserId = req.body.liked_user_id;

  // Check if the user has already liked the collection
  connection.query(
    "SELECT COUNT(*) as count FROM collection_likes WHERE user_id = ? AND liked_user_id = ?",
    [userId, likedUserId],
    (error, results) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .send("Error checking if user has already liked the collection");
        return;
      }

      // If the user has already liked the collection, do not allow them to like it again
      if (results[0].count > 0) {
        res.status(403).send("User has already liked the collection");
        return;
      }

      // Insert a new row into the collection_likes table
      connection.query(
        "INSERT INTO collection_likes (user_id, liked_user_id) VALUES (?, ?)",
        [userId, likedUserId],
        (error, results) => {
          if (error) {
            console.error(error);
            res
              .status(500)
              .send("Error inserting new like into collection_likes table");
            return;
          }

          res.redirect("/collections");
        }
      );
    }
  );
});

// Unlike a collection
app.post("/unlike-collection", (req, res) => {
  // Retrieve the user ID and collection ID from the request body
  const userId = req.body.user_id;
  const likedUserId = req.body.liked_user_id;

  // Delete the row from the collection_likes table
  connection.query(
    "DELETE FROM collection_likes WHERE user_id = ? AND liked_user_id = ?",
    [userId, likedUserId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error deleting like from collection_likes table");
        return;
      }

      res.redirect("/collections");
    }
  );
});

//account summary
app.get("/account", function (req, res) {
  if (!req.session || !req.session.authen) {
    res.redirect("/login");
    return;
  }

  let userId = req.session.authen;
  let sql =
    "SELECT user.user_id, user.first_name, user.last_name, user.email, COUNT(user_playlist.user_playlist_id) AS number_of_songs FROM user JOIN user_playlist ON user_playlist.user_id = user.user_id WHERE user.user_id = ?";
  connection.query(sql, [userId], function (error, results) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    let userDetails = {
      first_name: results[0].first_name,
      last_name: results[0].last_name,
      email: results[0].email,
      number_of_songs: results[0].number_of_songs,
    };

    res.render("account", { isAuthenticated: true, userDetails: userDetails });
  });
});

// Start listening for incoming requests on the defined port
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}: http://localhost:${PORT}`);
});
