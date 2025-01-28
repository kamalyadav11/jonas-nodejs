const express = require('express');

const {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
} = require('../controllers/userController');

const router = express.Router();

//Param Middleware
router.param('id', (req, res, next, val) => {
    console.log('The id value is ', val);
    next();
});

//Routers Middleware
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
