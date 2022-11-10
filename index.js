// This is where we will be building our Express server;

const express = require('express');
const {client} = require('./db/index');
const {usersRouter} = require('./routes/users');

// Setting up a new express server instance
const app = express();

// Sub Router


app.listen(3000, () => {
    console.log('We are now running on port 3000')
});