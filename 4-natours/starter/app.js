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

module.exports = app;
