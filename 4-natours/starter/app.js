const express = require('express');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//MIDDLEWARES
app.use(express.json()); //acts as a body-parser, helps us to attach data to req.body
app.use(express.static(`${__dirname}/public`)); //used to serve static files from folder mentioned in the static()

app.use((req, res, next) => {
    req.createdAt = new Date().toISOString();
    next();
});

//Routes -> Mounting Multiple Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cannot find ${req.originalUrl} on this server`,
    // });
    const err = new Error(`Cannot find ${req.originalUrl} on this server`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
    next();
});

module.exports = app;
