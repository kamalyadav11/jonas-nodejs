const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

//Enabling MongoDB Database Connection
const DB = process.env.DATABASE.replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD
);

//Connecting Mongoose to use MongoDB Cluster
mongoose.connect(DB).then(console.log('Connected to MongoDB Successfully'));

//Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

//Import data into the database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded');
    } catch (err) {
        console.log('Error importing data ', err);
    }
    process.exit();
};

// Delete all data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully Deleted!');
    } catch (err) {
        console.log('Error importing data ', err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log('Node process ', process.argv);
