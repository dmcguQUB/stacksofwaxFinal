//Import the mysql module to allow server to interact with SQL database
let mysql  = require('mysql');

// Create the connection to the MAMP sql database
let db = mysql.createConnection({
    host: 'localhost', // The database server's address
    user: 'root',      // The database user's username
    password: 'root',  // The database user's password
    database: 'stacksofwax', // The name of the database to connect to
    port: '8889'        // The port number the database server is listening on
});

// Set up the connection to the database and excecute
db.connect((err) => {
    // If error throw
    if(err) throw err;
});

// Export the connection object so that it can be used in other parts of the application
module.exports = db;
