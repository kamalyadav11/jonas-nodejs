module.exports = (fn) => {
    return (req, res, next) => {
        fn.catch((err) => next(err));
    };
};
