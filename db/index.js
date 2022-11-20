require('dotenv').config ();


// This is where we will be building our pg.Client instance;
const pg = require('pg');
let client 

if (process.env.user && process.env.password ) {
    client = new pg.Client({
        host: 'localhost',
        database: 'fitness-dev',
        port: 5432,
        //need your usernmae and password
        user: process.env.user,
        password: process.env.password,
    });
} else {
    client = new pg.Client('postgres://localhost:5432/fitness-dev');
}

if (process.env.db_url) {
    client = new pg.Client(process.env.db_url)
}

module.exports = {
    client
    // ...require('./users'),
    // ...require('./activities')
}