/*index.js file
This file is used to set up Node.js server using an Express framework
Routes and behaviours of the website are also defined with different pages of the web application
*/

//Importing of necessary packages for web page
const express = require("express"); // Import the express framework and eventually create instance of class
const cookieParser = require("cookie-parser"); //Import the cookie-parser middleware to parse and handle cookies to be used to enable sessions for the user
const sessions = require("express-session"); // Import express middleware to allow to store user sessions to maintain state across different web pages
const path = require("path"); // Import the path module to allow to access files and directory paths
const connection = require("./connection.js"); // import database connection module to set up connection to database

// create an instance of the express
let app = express();

// Create the constants to be used throughout the index.js file
const PORT = process.env.PORT || 3000; // define the port as a constant, specifically port 3000
const halfDay = 1000 * 60 * 60 * 12; // the constant for a session to last half a day

//import bycrypt library to hash user password stored in database for increased security
const bcrypt = require("bcrypt");
const saltRounds = 10; // Can increase the value for greater hashing and security but will slow down performance

//Create a path to serve the static web pages from the public folder
app.use(express.static(path.join(__dirname, "./public"))); // I use the express middleware here to serve the static files

//Set up middleware used to parse form data using express.urlencoded
app.use(express.urlencoded({ extended: false }));

//Ensure that the view engine for the EJS files are set up. This allows for the EJS files to have embedded JS to allow us to make dynamic HTML pages
app.set("view engine", "ejs");

// Set up an instance of the cookie parcer middleware and allow it to parse cookies to the HTTP header. This is important for identifying if a user is authenticated and maintaining sessions as they move through the web pages
app.use(cookieParser());

//Set up the session middleware using sessions()
app.use(
  sessions({
    secret: "thisismysecrctekey599", // secret key used for the session with expiration half a day
    saveUninitialized: true, // save new sessions even if the user has not modified anythinb in their request
    cookie: { maxAge: halfDay }, // ensure cookies expire after half a day
    resave: false, // only save session if there has been modifications during the request to reduce number of uncessary writes to the session store and help reduce the load on the server
  })
);

// Function to check user authentication to see if they are autheticated or not
// checkAuthenticated has 3 parameters req, res and next
function checkAuthenticated(req, res, next) {
  //check if req.session && req.session.authen are set for the session. If user has been autheticated
  //both will be true
  if (req.session && req.session.authen) {
    return next(); // passed back to sessions middleware to handle request
  }
  res.redirect("/login"); // if not autheticated then redirected to login
}

/*Login confirmation
Route to handle the login submission for a user 
 */
app.post("/login", (req, res) => {
  // collect the email and password information submittedb by the user on login page
  const { email, password } = req.body;

  // SQL query executed to check user details using the email parameter
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (error, results) => {
      //if there is an error throw this
      if (error) throw error;

      // if the query returns a result within the database
      if (results.length > 0) {
        // Compare the submitted password by the user with the stored hashed password using bcrypt
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
          // if there is an error with the comparison, please print the error to console and send an Error comparing the passwords
          if (err) {
            console.error(err);
            return res.status(500).send("Error comparing the passwords");
          }

          // if the password matches the stored hashed password in my database
          if (isMatch) {
            //set the user ID for the session as the user_id found in the database for user
            req.session.authen = results[0].user_id;
            // redirect to homepage
            res.redirect("/");
          } else {
            // If the passwords don't match, re-render the login page with an error message passed as parameter to be displayed to the user
            res.render("login", {
              errorMessage: "Incorrect email or password.",
              isAuthenticated: false,
            });
          }
        });
      } else {
        //If the email is not found in our database then render the login page again but pass in error message
        res.render("login", {
          errorMessage: "Incorrect email or password.",
          isAuthenticated: false,
        });
      }
    }
  );
});

//Route for login page
app.get("/login", (req, res) => {
  // display the login page with isAuthenticated to false
  res.render("login", { isAuthenticated: false });
});

/* Route to logout user
Destroys the session and redirects to homepage */
app.get("/logout",  (req, res)=> {
    // Destroy the session and redirect to the homepage
  req.session.destroy(function (err) {
    //throw error if issue
    if (err) throw err;
    //redirect to homepage
    res.redirect("/");
  });
});


//Route for register page
app.get("/register",  (req, res) =>{
  //create and intialise variables with empty values. These are needed for error message if incorrect details inputted
  let errorMessage = "";
  let firstName = "";
  let lastName = "";
  let email = "";

  // Render the register page with the variables and isAuthenticated set to false
  res.render("register", {
    errorMessage,
    firstName,
    lastName,
    email,
    isAuthenticated: false,
  });
});

/*Route for registration process
First checks all fields are filled out and if passwords match
Second, check if email exists in database
If all valid, then password is hashed and user details inserted into the database
After sucessful registration, user directed to login page */
app.post("/register", (req, res) => {
  //variables recieved from the user filling out registration form and submitted
  const { firstName, lastName, email, password, passwordConfirm } = req.body;
  //create empty default message
  let errorMessage = "";

  // Check if user has entered any empty fields
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    errorMessage = "All fields are required.";
    //if any field null render the page with error message displayed
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
    //render page with error message for passwords not matching
    return res.render("register", {
      errorMessage,
      firstName,
      lastName,
      email,
      isAuthenticated: false,
    });
  }

  // Query database to check if the email entered already exists
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (error, results) => {
      //if error with query log to console and provide an error message
      if (error) {
        console.error(error);
        return res.status(500).send("Error registering the user");
      }

      // if the email exists in the database, create an error message and render page that the email already exists
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

      // For extra security, hash the password using bcrypt and passing password and saltRounds as paramater
      bcrypt.hash(password, saltRounds, (err, hash) => {
        //if error with query log to console and provide an error message

        if (err) {
          console.error(err);
          return res.status(500).send("Error hashing the password");
        }

        // If all validation passes, create an insert query for the new user with hashed password
        const insertUserQuery = `
        INSERT INTO user (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?)
      `;
        //execute insert query with all parameter above provided
        connection.query(
          insertUserQuery,
          [firstName, lastName, email, hash],
          (error, results) => {
            //if error with query log to console and provide an error message
            if (error) {
              console.error(error);
              return res.status(500).send("Error registering the user");
            }

            // Redirect the user to the if registrated correctly
            return res.redirect("/login");
          }
        );
      });
    }
  );
});


/* Route for homepage. 
If the user is autheticated, the code servers gets the data needed, passes the object userdata and then renders the EJS file for authethenticated user. Also, authenticated boolean is chnaged to true.
If the user is not authenticated (doesn't log in) then default index.js file is rendered. Is authenticated is set to false.
*/
app.get("/",  (req, res)=> {
  //check if the user has authenticated
  if (req.session && req.session.authen) {
    //If true, get the userID for the session
    let uid = req.session.authen;
    //query database to get user information
    let user = "SELECT * FROM user WHERE user_id = ?";
    //execute the query passing in the userID as a parameter
    connection.query(user, [uid], (err, row) => {
      //if there is an error throw this
      if (err) throw err;
      //select the first row of the results
      let firstrow = row[0];
      //render the index.ejs file passing in userdata infor and setting isAuthenticated to true
      res.render("index", { userdata: firstrow, isAuthenticated: true });
    });
    // if authentification is false, render index.ejs file and set the isAuthenticated to false
  } else {
    res.render("index", { isAuthenticated: false });
  }
});

/*Route for discover.ejs page
When a client makes a get request for the discover.ejs page this route is executed
*/
app.get("/discover",  (req, res) =>{
  //Get the genre or artist query information passed by the client, or use an empty query information as default
  let genre = req.query.genre || "";
  let artist = req.query.artist || "";

  //Check if the user is authenticated
  let isAuthenticated = req.session && req.session.authen;

  //SQL Query to fetch all records based on the filters selected for genre and artist. Distinct in query helps to remove duplicates created due to records having more than one genre.
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

  // SQL query to fetch all the genres from the database to display on webpage for filter
  let genreSql = "SELECT * FROM genre ORDER BY genre_title ASC";
  // SQL query to fetch all the artist from the database to display on webpage for search filter
  let artistSql = "SELECT * FROM artist ORDER BY artist_name ASC";

  //Excute the main query for record information passing genre and artist filters as parameters
  connection.query(sql, [`%${genre}%`, `%${artist}%`], function (err, rows) {
    //if there is an error throw this
    if (err) throw err;
    // execute the genre query
    connection.query(genreSql, function (err, genres) {
      if (err) throw err;
      // execute the genre query
      connection.query(artistSql, function (err, artists) {
        if (err) throw err;

        // Render the discover page passing in data retrieved, isAuthenticated status for session and the filters
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

// Route to add a record to a user's playlist. 
app.post("/add-to-playlist", (req, res) => {
  //ensure that the user is authenticated
  let isAuthenticated = req.session && req.session.authen;
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }
  let userId = req.session.authen; // use the session user ID to assign to userId var
  let { record_id } = req.body; // Get the record_id for the song the user has requested to add to playlist

  // isNaN is a function that checks if the record is not a number. If it is not a number then it is true.
  // record_id < 1 ensures that the record is a postive number
  if (isNaN(record_id) || record_id < 1) {
    //if either are true then send an error message
    res.status(400).send("Invalid record ID");
    return; // returns the error message and prevents other code from being executed
  }

  // Execute query to insert the user_id and record_id into the user_playlist
  connection.query(
    "INSERT INTO user_playlist (user_id, record_id) VALUES (?, ?)",
    [userId, record_id],
    (error, results) => {
      //if error throw this
      if (error) throw error;
      res.redirect("/discover"); // Redirect to the discover page
    }
  );
});

// Route to remove a record to a user's playlist. 
app.post("/remove-from-playlist", (req, res) => {
  //check if authenticated
  let isAuthenticated = req.session && req.session.authen;

  //if not authenticated then redirect to login
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }
  let userId = req.session.authen; // use the session user ID to assign to userId var
  let { record_id } = req.body; // Get the record_id for the song the user has requested to add to playlist

  // isNaN is a function that checks if the record is not a number. If it is not a number then it is true.
  // record_id < 1 ensures that the record is a postive number
  if (isNaN(record_id) || record_id < 1) {
    //if either are true then send an error message
    res.status(400).send("Invalid record ID");
    return; // returns the error message and prevents other code from being executed
  }

  // Delete the record selected from user_playlist table
  connection.query(
    "DELETE FROM user_playlist WHERE user_id = ? AND record_id = ?",
    [userId, record_id],
    (error, results) => {
      if (error) throw error;
      res.redirect("/myplaylist"); // Redirect to the myplaylist page
    }
  );
});

/*Route for getting user's playlist
This shows authenticated users records added to their playlist. If they aren't logged in they are sent to login page */
app.get("/myplaylist",  (req, res)=> {
  //check if user has autenticated and sets the isAuthenticated corresponding to this 
  let isAuthenticated = req.session && req.session.authen;

  //if they aren't authenticated they are redirected to login page
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }

  //set the userId var from the userID used in the session
  let userid = req.session.authen;

  // SQL query which fetches all the records found in the user's playlist, groups  by record_id to prevent duplicates of songs with multiple genres
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

  //Excecute the SQL query passing in the sql query and userid as parameters to view the corresponding playlist on template page
  connection.query(sql, userid, function (err, rows) {
    //if error throw
    if (err) throw err;
    //render the myplaylist page with the corresponding records
    res.render("myplaylist", {
      record: rows,
      isAuthenticated: isAuthenticated,
      userdata: req.user,
    });
  });
});


// Route for the collections page showing user playlists
app.get("/collections", (req, res) => {
  // Check if authenticated
  let isAuthenticated = req.session && req.session.authen;

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }

  //set the userid var from the session user id
  let userId = req.session.authen;

  // SQL Select query to get the users playlist information. Contains subqueries to count the number of likes for their collection.
  // Another conditional subquery that checks if the current user (shown by ? placeholder) has liked the playlist. If they have will be 1, if not will be 0
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

  // SQL query to get the comments for a specific user playlists
  let commentsQuery = `
  SELECT
    collection_comments.commenter_id,
    user.first_name AS commenter_first_name,
    user.last_name AS commenter_last_name,
    collection_comments.playlist_creator_id,
    collection_comments.comment,
    collection_comments.created_at
  FROM
    collection_comments
  JOIN
    user ON collection_comments.commenter_id = user.user_id
  WHERE
    collection_comments.playlist_creator_id IN (
      SELECT DISTINCT
        user_playlist.user_id
      FROM
        user_playlist
    );
  `;

  // execute qiery so that the user collection and likes are retrieved
  connection.query(collectionsQuery, [userId], (err, userCollections) => {
    if (err) {
      //if error throw
      console.error(err);
      res.status(500).send("Error retrieving user collections");
      return; // returns statement and stops code from running
    }

    // Execute query to get the user comments for playlist
    connection.query(commentsQuery, (err, comments) => {
      if (err) {
              //if error throw
        console.error(err);
        res.status(500).send("Error retrieving comments");
        return;  // returns statement and stops code from running
      }

      // Render the collections page with userCollections, comments, isAuthenticated, and userId
      res.render("collections", {
        userCollections: userCollections,
        comments: comments,
        isAuthenticated: isAuthenticated,
        userId: userId,
      });
    });
  });
});

// Route for adding a comment to a collection
app.post("/add-comment", (req, res) => {
  // Check if the user is authenticated and set the isAuthenticated variable accordingly
  let isAuthenticated = req.session && req.session.authen;

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }

  // From the requested for of adding a comment get commenter ID, playlist creator ID, and the comment from the request body
  let commenterId = req.body.commenter_id;
  let playlistCreatorId = req.body.playlist_creator_id;
  let comment = req.body.comment;

  // Execute the SQL Insert query adding the new comment into the collection_comments table
  connection.query(
    "INSERT INTO collection_comments (commenter_id, playlist_creator_id, comment) VALUES (?, ?, ?)",
    [commenterId, playlistCreatorId, comment],
    (error, results) => {
      // If there is an error, log the error in the console and send a response with an error message
      if (error) {
        console.error(error);
        res
          .status(500)
          .send("Error inserting new comment into collection_comments table");
        return;
      }

      // If the comment is successfully added, redirect the user back to the collections page
      res.redirect("/collections");
    }
  );
});

// Route for displaying a specific user's collection with reduced functionality as they can't edit the playlist
app.get("/collection/:userId", (req, res) => {
    // Check if authenticated
    let isAuthenticated = req.session && req.session.authen;
  
    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
      res.redirect("/login");
      return;
    }
  // Extract the user ID from the URL parameter of playlist
  let userIdPlaylistCreator = req.params.userId;

  // SQL query to retrieve the records in a collection of a specific user ID. The artist name and genre are concatonated for 
  //records which have more than one. This means they will be displayed in one line with a comman
  //Group by record_id and artist_id to ensure only unqique values are displayed
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

  // Call the SQL query and pass in the userIdPlaylistCreator of the playlist you want to view
  connection.query(query, [userIdPlaylistCreator], (err, records) => {
    // If there is an error, throw the error
    if (err) throw err;

    // Display the user collection page and show all records within the collection
    res.render("user_collection", {
      records,
      isAuthenticated: isAuthenticated,
    });
  });
});

  //Route to allow a user to like another users playlist / collection
// Route to allow a user to like a collection
app.post("/like-collection", (req, res) => {

  // Check if the user is authenticated and set the isAuthenticated variable accordingly
  let isAuthenticated = req.session && req.session.authen;

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    res.redirect("/login");
    return;
  }

  // Retrieve the user ID of the user requesting to like and the ID of the user whose playlist will be liked
  const userId = req.body.user_id;
  const likedUserId = req.body.liked_user_id;

  // Execute an SQL query to check if the user has already liked the collection
  connection.query(
   "SELECT COUNT(*) as count FROM collection_likes WHERE user_id = ? AND liked_user_id = ?",
   [userId, likedUserId],
   (error, results) => {
     if (error) {
       // If there's an error retrieving the information, log the error and send an error response
       console.error(error);
       res
         .status(500)
         .send("Error retrieving info if the user has liked the collection");
       return;
     }

     // If the user has already liked the collection, send a 403 status and a message indicating the action is not allowed
     if (results[0].count > 0) {
       res.status(403).send("User has already liked the collection");
       return;
     }

     // If the user hasn't liked the collection yet, insert a new row into the collection_likes table
     connection.query(
       "INSERT INTO collection_likes (user_id, liked_user_id) VALUES (?, ?)",
       [userId, likedUserId],
       (error, results) => {
         if (error) {
           // If there's an error inserting the new like, log the error and send an error response
           console.error(error);
           res
             .status(500)
             .send("Error inserting new like into collection_likes table");
           return;
         }

         // After successfully liking the collection, redirect the user to the collections page
         res.redirect("/collections");
       }
     );
   }
 );
});


// Unlike a collection
app.post("/unlike-collection", (req, res) => {

   // Check if the user is authenticated and set the isAuthenticated variable accordingly
   let isAuthenticated = req.session && req.session.authen;

   // If the user is not authenticated, redirect them to the login page
   if (!isAuthenticated) {
     res.redirect("/login");
     return;
   }
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

//Route to accounts page
app.get("/account",  (req, res)=> {
 // Check if the user is authenticated and set the isAuthenticated variable accordingly
 let isAuthenticated = req.session && req.session.authen;

 // If the user is not authenticated, redirect them to the login page
 if (!isAuthenticated) {
   res.redirect("/login");
   return;
 }

 //get user ID from session
  let userId = req.session.authen;

  //SQL query to get user information to populate the accounts page using the userId
  let sql =
    `SELECT 
    user.user_id, 
    user.first_name, 
    user.last_name, 
    user.email, 
    COUNT(user_playlist.user_playlist_id) AS number_of_songs 
  FROM 
    user 
  JOIN 
    user_playlist ON user_playlist.user_id = user.user_id 
  WHERE 
    user.user_id = ?`;

    //Execute SQL query passing in the query and userId as parameters
  connection.query(sql, [userId], function (error, results) {
    if (error) {
      //throw error if present
      console.log(error);
      res.sendStatus(500);
      return;
    }

    // assign the results to the vars to populate accounts page within object userDetails
    let userDetails = {
      first_name: results[0].first_name,
      last_name: results[0].last_name,
      email: results[0].email,
      number_of_songs: results[0].number_of_songs,
    };

    //render the accounts page passing in isAuthenticated and userdetails
    res.render("account", { isAuthenticated: isAuthenticated, userDetails: userDetails });
  });
});

// Route for the terms page. This allows all users to access the page authenticated or not. However, it means authenticated users maintain their session if they click page
app.get("/terms",  (req, res)=> {
  // Check if the user has an active session
  const isAuthenticated = req.session && req.session.authen;

  // Render the terms page, passing the isAuthenticated variable
  res.render("terms", { isAuthenticated: isAuthenticated });
});

// Route for the privacy page
app.get("/privacy",  (req, res)=> {
  const isAuthenticated = req.session && req.session.authen;
  res.render("privacy", { isAuthenticated: isAuthenticated });
});

// Route for the faq page
app.get("/faq",  (req, res)=> {
  const isAuthenticated = req.session && req.session.authen;
  res.render("faq", { isAuthenticated: isAuthenticated });
});

// Route for the about page
app.get("/about",  (req, res)=> {
  const isAuthenticated = req.session && req.session.authen;
  res.render("about", { isAuthenticated: isAuthenticated });
});

// Route for the contact us page
app.get("/contactus",  (req, res) =>{
  const isAuthenticated = req.session && req.session.authen;
  res.render("contactus", { isAuthenticated: isAuthenticated });
});

// Route for the pricing page
app.get("/pricing",  (req, res)=> {
  const isAuthenticated = req.session && req.session.authen;
  res.render("pricing", { isAuthenticated: isAuthenticated });
});


// Start listening for incoming requests on the defined port
app.listen(PORT,  () =>{
  console.log(`Server is listening on port ${PORT}: http://localhost:${PORT}`);
});
