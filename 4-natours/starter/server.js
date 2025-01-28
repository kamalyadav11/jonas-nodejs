const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
app.listen(PORT, () => {
    console.log('App running on PORT', PORT);
});
