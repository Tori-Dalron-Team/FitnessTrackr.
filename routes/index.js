const express = require('express')
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
const { getUserById } = require('../db/users')

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    
    if (!auth) { console.log("No auth")
    next();
    } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
        console.log("We have Auth")
    try {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        console.log("this is parsed token", parsedToken)
        const id = parsedToken && parsedToken.id
        if (id) {
            console.log("we have id")
        req.user = await getUserById(id);
        console.log("this is is id and req.user", id, req.user)
        next();
        }
    } catch (error) {
        next(error);
    }
    } else {
    next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
    });
    }
});

const { usersRouter } = require('./users');
apiRouter.use('/users', usersRouter);
const { router } = require('./activities');
apiRouter.use('/activities', router);
const { routineRouter } = require('./routines');
apiRouter.use('/routines', routineRouter);
const { routineActivitiesRouter } = require('./routineactivities')
apiRouter.use('/routineactivities', routineActivitiesRouter)

module.exports = {
    apiRouter
}