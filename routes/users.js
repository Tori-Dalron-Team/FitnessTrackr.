const express = require('express');
const usersRouter = express.Router();
const { getUser, createUser, getUserById, getUserByUsername } = require('../db/users');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

usersRouter.use((req,res,next) => {
    console.log("A request is being made to /users");

    next();
});
usersRouter.get('/', async (req,res,next) => {
    const users = await getUser();
    // console.log("this is all users", getAllUsers)
    res.send({
        users
    });
});

usersRouter.get('/profile', async (req, res, next) => {
    const myUserInfo = await getUserbyUsername();
    res.send({
        myUserInfo
    })
})


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password) {
    next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
    });
    }

    try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
        const newToken = jwt.sign(password, JWT_SECRET)
        console.log(newToken)
        res.send({ message: "you're logged in!", token: newToken, success: true });
    } else {
        next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
        });
    }
    } catch(error) {
    console.log(error);
    next(error);
    }
});
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
    const _user = await getUserByUsername(username);

    if (_user) {
        next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
        });
    }

    const user = await createUser({
        username,
        password
        
    });

    const token = jwt.sign({ 
        id: user.id, 
        username
    }, JWT_SECRET, {
        expiresIn: '1w'
    });

    res.send({ 
        message: "thank you for signing up",
        token 
    });
    } catch ({ name, message }) {
        console.log("this is the message",message)
    next({ name, message })
    } 
});

module.exports = {
    usersRouter
}