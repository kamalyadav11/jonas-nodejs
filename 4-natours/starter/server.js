const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION ', err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

//Enabling MongoDB Database Connection
const DB = process.env.DATABASE.replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD
);

//Connecting Mongoose to use MongoDB Cluster
mongoose.connect(DB).then(console.log('Connected to MongoDB Successfully'));

// const testTour = new Tour({
//     name: 'The Snow Hiker',
//     rating: 4.7,
//     price: 297,
// });

// //this will save this to the tour collection in the database
// testTour
//     .save()
//     .then((doc) => console.log('DOCS: ', doc))
//     .catch((err) => console.log('ERR: ', err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log('App running on PORT', PORT);
});

process.on('unhandledRejection', (err) => {
    console.log('error ', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
