const express = require('express');
const usersRouter = express.Router();

usersRouter.use((req,res,next) => {
    console.log("A request is being made to /users");

    next();
});

module.exports = {
    usersRouter
}