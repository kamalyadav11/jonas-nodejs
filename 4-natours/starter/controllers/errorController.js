const AppError = require('../utils/appErrors');

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err, name: err.name, message: err.message };

    if (error.name === 'CastError') error = handleCastError(error);

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
    next();
};
