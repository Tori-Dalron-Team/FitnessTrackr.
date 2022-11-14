// This is where we will be building our Express server;
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('./db/index');
const { apiRouter } = require('./routes/index')


// Setting up a new express server instance
const app = express();

// Sub Router
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use('/api', apiRouter);

client.connect();
app.listen(3000, () => {
    console.log('We are now running on port 3000')
});

module.exports = {
    client,
    jwt,
    bcrypt
}