const express = require('express')
const apiRouter = express.Router();


const { usersRouter } = require('./users');
apiRouter.use('/users', usersRouter);
const { router } = require('./activities');
apiRouter.use('/activities', router);

module.exports = {
    apiRouter
}