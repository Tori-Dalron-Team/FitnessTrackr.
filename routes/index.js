const express = require('express')
const apiRouter = express.Router();


const { usersRouter } = require('./users');
apiRouter.use('/users', usersRouter);
const { router } = require('./activities');
apiRouter.use('/activities', router);
const { routineRouter } = require('./routines');
apiRouter.use('/routines', routineRouter);

module.exports = {
    apiRouter
}