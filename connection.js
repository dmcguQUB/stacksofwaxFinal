//MAMP
//defines connection to a mySQL database using the mysql node module. This creates db object which then connects to the datasbse using using the mysql.createConnection() method
//after creating the obkect the db.connect() method establishes the connection between the database and server. If there is an error, an error message is provided.
// The module.exports statement allows for the db connection object to be imported into other parts of the application (i.e. index.js file)
let mysql  = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'stacksofwax',
    port: '8889' 
});

db.connect((err)=> {
    if(err) throw err;
});

module.exports = db;
