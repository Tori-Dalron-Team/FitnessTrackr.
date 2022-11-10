// This is where we will be building our pg.Client instance;
const pg = require('pg');
const client = new pg.Client({
    host: 'localhost',
    database: 'fitness-dev',
    port: 5432,
    //need your usernmae and password
    user: ,
    password: ,
});

module.exports = {
    client
}